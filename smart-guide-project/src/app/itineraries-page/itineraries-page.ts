import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';

import esri = __esri;

import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
import Search from "@arcgis/core/widgets/Search";

import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import Polygon from "@arcgis/core/geometry/Polygon";
import Polyline from "@arcgis/core/geometry/Polyline";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters";
import * as route from "@arcgis/core/rest/route";
import * as locator from "@arcgis/core/rest/locator";

@Component({
  selector: 'app-itineraries-page',
  imports: [],
  templateUrl: './itineraries-page.html',
  styleUrl: './itineraries-page.css',
})
export class ItinerariesPage implements OnInit, OnDestroy {
  @ViewChild("mapViewNode", { static: true }) private mapViewEl!: ElementRef;

  // Initialize view as null
  private view: MapView | null = null;
  map!: esri.Map;

  // Layers
  graphicsLayer!: esri.GraphicsLayer;
  graphicsLayerUserPoints!: esri.GraphicsLayer;
  graphicsLayerRoutes!: esri.GraphicsLayer;
  monumentsLayer!: esri.FeatureLayer;

  zoom = 10;
  center: number[] = [26.1024, 44.4268];
  basemap = "streets-vector";
  loaded = false;
  directionsElement: any;

  ngOnInit() {
    if (typeof window !== "undefined") { // Fixed 'undefined' check
      this.initializeMap();
    }
  }

  async initializeMap() {
    try {
      const mapProperties: esri.WebMapProperties = { basemap: this.basemap };
      this.map = new WebMap(mapProperties);

      this.addFeatureLayers();
      this.addGraphicsLayer();

      const mapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this.center,
        zoom: this.zoom,
        map: this.map
      };

      // Error suppression for ResizeObserver (common in ArcGis)
      const resizeObserverLoopErr = 'ResizeObserver loop limit exceeded';
      const _originalError = console.error;
      console.error = (...args) => {
        if (args.length > 0 && typeof args[0] === 'string' && args[0].includes(resizeObserverLoopErr)) {
          return;
        }
        _originalError.apply(console, args);
      };

      window.addEventListener('error', (event) => {
        if (event.message === resizeObserverLoopErr) {
          event.stopImmediatePropagation();
        }
      });

      this.view = new MapView(mapViewProperties);
      await this.view.when();
      console.log("ArcGIS map loaded");

      this.addRouting();
      this.addSearchWidget();

      return this.view;
    } catch (error) {
      console.error("Error loading the map ", error);
      alert("Error while loading the map");
    }

    return null;
  }

  addFeatureLayers() {
    this.monumentsLayer = new FeatureLayer({
      url: "https://services7.arcgis.com/xN1YpHdP6PeZuK0R/arcgis/rest/services/historical_data_dude/FeatureServer/"
    });

    this.map.add(this.monumentsLayer);
    console.log("Feature layers added");
  }

  addGraphicsLayer() {
    this.graphicsLayer = new GraphicsLayer();
    this.map.add(this.graphicsLayer);
    this.graphicsLayerUserPoints = new GraphicsLayer();
    this.map.add(this.graphicsLayerUserPoints);
    this.graphicsLayerRoutes = new GraphicsLayer();
    this.map.add(this.graphicsLayerRoutes);
  }

  addSearchWidget() {
    // Guard clause: Check if view exists
    if (!this.view) return;

    const searchWidget = new Search({
      view: this.view,
      includeDefaultSources: true,
      locationEnabled: true,
      popupEnabled: true
    });

    this.view.ui.add(searchWidget, {
      position: "top-right",
      index: 0
    });

    console.log("Search widget added");
  }

  async performCategorySearch(category: string) {
    // Guard clause: Check if view exists
    if (!this.view) return;

    const geocodeUrl = "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";

    const params = {
      address: {},
      category,
      location: this.view.center,
      outFields: ["PlaceName", "Place_addr"],
      maxLocations: 20,
      outSpatialReference: this.view.spatialReference,
      searchExtent: this.view.extent,
    };

    this.graphicsLayer.removeAll();

    try {
      const results = await locator.addressToLocations(geocodeUrl, params);
      console.log(`Found ${results.length} places for ${category}`);

      results.forEach((result: any) => {
        const point = result.location;
        const symbol = {
          type: "simple-marker" as const,
          color: [0, 122, 255, 0.8],
          size: 8,
          outline: { color: [255, 255, 255], width: 1 }
        };

        const popupTemplate = {
          title: "{PlaceName}",
          content: "{Place_addr}"
        };

        const graphic = new Graphic({
          geometry: new Point(point),
          symbol,
          attributes: result.attributes,
          popupTemplate
        });

        this.graphicsLayer.add(graphic);
      });

      if (results.length === 0) {
        alert("No results found for " + category);
      }
    } catch (err) {
      console.error("Error performing category search:", err);
      alert("Failed to search category. Check your API key and network.");
    }
  }

  addPolygon() {
    const polygon = new Polygon({
      rings: [
        [
          [-118.818984489994, 34.0137559967283],
          [-118.806796597377, 34.0215816298725],
          [-118.791432890735, 34.0163883241613],
          [-118.79596686535, 34.008564864635],
          [-118.808558110679, 34.0035027131376],
          [-118.818984489994, 34.0137559967283]
        ]
      ],
      spatialReference: { wkid: 4326 }
    });

    const simpleFillSymbol = {
      type: "simple-fill" as const,
      color: [227, 139, 79, 0.8],
      outline: { color: [255, 255, 255], width: 1 }
    };

    const polygonGraphic = new Graphic({
      geometry: polygon,
      symbol: simpleFillSymbol
    });

    this.graphicsLayer.add(polygonGraphic);
    console.log("Polygon added");
  }

  addPolyline() {
    const polyline = new Polyline({
      paths: [
        [
          [-118.821527826096, 34.0139576938577],
          [-118.814893761649, 34.0080602407843],
          [-118.808878330345, 34.0016642996246]
        ]
      ],
      spatialReference: { wkid: 4326 }
    });

    const simpleLineSymbol = {
      type: "simple-line" as const,
      color: [226, 119, 40],
      width: 3
    };

    const polylineGraphic = new Graphic({
      geometry: polyline,
      symbol: simpleLineSymbol
    });

    this.graphicsLayer.add(polylineGraphic);
    console.log("Polyline added");
  }

  addDot() {
    const point = new Point({
      longitude: -118.80657463861,
      latitude: 34.0005930608889
    });

    const simpleMarkerSymbol = {
      type: "simple-marker" as const,
      color: [255, 0, 0],
      outline: { color: [255, 255, 255], width: 1 }
    };

    const pointGraphic = new Graphic({
      geometry: point,
      symbol: simpleMarkerSymbol
    });

    this.graphicsLayer.add(pointGraphic);
    console.log("Dot added");
  }

  addRouting() {
    // Guard clause: Check if view exists
    if (!this.view) return;

    const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

    this.view.on("click", (event) => {
      // Must check if view exists inside the callback
      if (!this.view) return;

      this.view.hitTest(event).then((elem: esri.HitTestResult) => {
        if (elem && elem.results && elem.results.length > 0) {

          // 1. Find the result that belongs to the monuments layer
          const foundResult = elem.results.find(
            (e) => e.layer === this.monumentsLayer
          );

          // 2. Check if the result exists and has a mapPoint
          if (foundResult && foundResult.mapPoint) {
            const point = foundResult.mapPoint;

            // 3. SAFETY CHECK: Ensure latitude and longitude are actually numbers
            if (point.latitude !== undefined && point.longitude !== undefined) {

              if (this.graphicsLayerUserPoints.graphics.length === 0) {
                this.addPoint(point.latitude as number, point.longitude as number);
              } else if (this.graphicsLayerUserPoints.graphics.length === 1) {
                this.addPoint(point.latitude as number, point.longitude as number);
                this.calculateRoute(routeUrl);
              } else {
                this.removePoints();
              }
            }
          }
        }
      });
    });
  }

  async calculateRoute(routeUrl: string) {
    const routeParams = new RouteParameters({
      stops: new FeatureSet({
        features: this.graphicsLayerUserPoints.graphics.toArray()
      }),
      returnDirections: true
    });

    try {
      const data = await route.solve(routeUrl, routeParams);
      this.displayRoute(data);
    } catch (error) {
      console.error("Error calculating route: ", error);
      alert("Error calculating route");
    }
  }

  addPoint(lat: number, lng: number) {
    const point = new Point({ longitude: lng, latitude: lat });
    const simpleMarkerSymbol = {
      type: "simple-marker" as const,
      color: [226, 119, 40],
      outline: { color: [255, 255, 255], width: 1 }
    };
    const pointGraphic = new Graphic({
      geometry: point,
      symbol: simpleMarkerSymbol
    });
    this.graphicsLayerUserPoints.add(pointGraphic);
  }

  removePoints() {
    this.graphicsLayerUserPoints.removeAll();
  }

  removeRoutes() {
    this.graphicsLayerRoutes.removeAll();
  }

  clearRouter() {
    if (this.view) {
      this.removeRoutes();
      this.removePoints();
      this.view.ui.remove(this.directionsElement);
      this.view.ui.empty("top-right");
    }
  }

  displayRoute(data: any) {
    for (const result of data.routeResults) {
      result.route.symbol = {
        type: "simple-line" as const,
        color: [5, 150, 255],
        width: 3
      };
      this.graphicsLayerRoutes.graphics.add(result.route);
    }
    if (data.routeResults.length > 0) {
      this.showDirections(data.routeResults[0].directions.features);
    } else {
      alert("No directions found");
    }
  }

  showDirections(features: any[]) {
    // Guard clause
    if (!this.view) return;

    this.directionsElement = document.createElement("ol");
    this.directionsElement.classList.add(
      "esri-widget",
      "esri-widget--panel",
      "esri-directions__scroller"
    );
    this.directionsElement.style.marginTop = "0";
    this.directionsElement.style.padding = "15px 15px 15px 30px";

    features.forEach((result) => {
      const direction = document.createElement("li");
      direction.innerHTML = `${result.attributes.text} (${result.attributes.length} miles)`;
      this.directionsElement.appendChild(direction);
    });

    this.view.ui.empty("top-right");
    this.view.ui.add(this.directionsElement, "top-right");
  }

  ngOnDestroy() {
    if (this.view) {
      this.view.container = null; // Type 'null' is not assignable to type 'HTMLDivElement'.
      // In newer ArcGIS JS versions, you use view.destroy() or just unset it
      // this.view.destroy();
    }
  }
}