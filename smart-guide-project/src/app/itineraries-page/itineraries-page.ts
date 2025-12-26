import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  inject
} from '@angular/core';

import esri = __esri;
import esriConfig from "@arcgis/core/config";

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
import Zoom from "@arcgis/core/widgets/Zoom";

import axios from 'axios'
import { AuthService } from '../auth-service'
import { Monument } from '../backend/reviews/model/MonumentModel';
import { Itinerary } from '../backend/reviews/model/ItineraryModel';

//esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurGT8HsxDQZv0a-E5-Pp4xAkozU8OAnR5uJIVOrfwfayqZwyQ02UwOyDLFZq_9Yulma9sfefRFFQbJbP0uLHGxClsEss4Xr91H2LFDvT8LauK1DJCi5lA4NecajERkMoymfKAQb-Gf730NbwZhBXNcvJzVN_y31BaUXHqZOq62EPMA9Ytw2hTQLRUOoPDBbZfWZO4SB3dhPaa63d5IU761MxtHYtTkZhCktKRUT9ODrIsAT1_eTw0FYWI";

@Component({
  selector: 'app-itineraries-page',
  imports: [],
  templateUrl: './itineraries-page.html',
  styleUrl: './itineraries-page.css',
})
export class ItinerariesPage implements OnInit, OnDestroy {
  @ViewChild("mapViewNode", { static: true }) private mapViewEl!: ElementRef;

  // user related monuments
  userMonuments: Monument[] = [];
  userEmail: string = "";

  // Initialize view as null
  private view: MapView | null = null;
  authService = inject(AuthService);
  map!: esri.Map;
  itineraryBuildingsNames: String[] = [];

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

  async ngOnInit() {
    if (typeof window !== "undefined") {
      this.initializeMap();

      const monumentsRetrievalUrl = "http://localhost:3000/api/reviews/monument-by-user";
      const userEmail = await this.authService.getEmail();
      const response = await axios.post(monumentsRetrievalUrl, { email: userEmail });
      this.userMonuments = response.data as Monument[];
    }
  }

  async generateNewItineraryRoute() {
    if (!this.view || !this.monumentsLayer) return;

    const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

    try {
      // 1. Define the center of Bucharest as the reference point
      const bucharestCenter = new Point({
        longitude: 26.1024,
        latitude: 44.4268
      });

      // 2. Fetch user's monument list
      const userMonuments = this.userMonuments;

      if (!userMonuments || userMonuments.length === 0) {
        this.monumentsLayer.definitionExpression = "1=2";
        return;
      }

      const cleanNames = userMonuments.map(m => m.name.replace(/"/g, "").replace(/'/g, "''"));

      // 3. Configure the Proximity Query centered on Bucharest
      const query = this.monumentsLayer.createQuery();
      query.where = `name IN ('${cleanNames.join("','")}')`;
      query.geometry = bucharestCenter;
      query.distance = 3;
      query.units = "kilometers";
      query.spatialRelationship = "intersects";
      query.outFields = ["OBJECTID", "name"];
      query.returnGeometry = true;

      const result = await this.monumentsLayer.queryFeatures(query);

      if (result.features.length > 0) {
        let selectedFeatures: esri.Graphic[] = [];
        if (result.features.length > 3) {
          selectedFeatures = result.features.sort(() => Math.random() - 0.5).slice(0, 3);
        } else {
          selectedFeatures = result.features;
        }

        const ids = selectedFeatures.map(f => f.attributes.OBJECTID || f.attributes.ObjectId);
        this.itineraryBuildingsNames = selectedFeatures.map(f => f.attributes.name);

        this.monumentsLayer.definitionExpression = `OBJECTID IN (${ids.join(",")})`;

        const centerGraphic = new Graphic({
          geometry: bucharestCenter,
          symbol: {
            type: "simple-marker",
            style: "cross",
            cap: "round",
            join: "round",
            color: [255, 0, 0],
            size: 12,
            outline: { color: [255, 255, 255], width: 2 }
          } as any
        });

        this.graphicsLayerRoutes.removeAll();
        this.graphicsLayerUserPoints.removeAll();
        this.graphicsLayerUserPoints.add(centerGraphic);

        const routeStops = [centerGraphic, ...selectedFeatures];
        await this.calculateRouteFromFeatures(routeStops, routeUrl);

      } else {
        alert("No monuments from your list were found within 5km of Bucharest center.");
      }
    } catch (error) {
      console.error("Error generating Bucharest itinerary:", error);
    }
  }

  async calculateRouteFromFeatures(features: esri.Graphic[], routeUrl: string) {
    const routeParams = new RouteParameters({
      stops: new FeatureSet({
        features: features
      }),
      returnDirections: true,
      preserveLastStop: true
    });

    try {
      const data = await route.solve(routeUrl, routeParams);

      if (data.routeResults && data.routeResults.length > 0) {
        const routeResult = data.routeResults[0].route;

        if (routeResult && routeResult.geometry && routeResult.geometry.extent) {
          routeResult.symbol = {
            type: "simple-line",
            color: [5, 150, 255, 0.7],
            width: 4
          } as any;

          this.graphicsLayerRoutes.add(routeResult);
          this.view?.goTo(routeResult.geometry.extent.expand(1.5));

          if (data.routeResults[0].directions) {
            this.showDirections(data.routeResults[0].directions.features);
          }
        }
      }
    } catch (error) {
      console.error("Route solving failed:", error);
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
        map: this.map,
        ui: {
          components: []
        }
      };

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
      this.addZoomWidget();

      return this.view;
    } catch (error) {
      console.error("Error loading the map ", error);
      alert("Error while loading the map");
    }

    return null;
  }

  addZoomWidget() {
    if (!this.view) return;

    const zoomWidget = new Zoom({
      view: this.view,
      container: "my-zoom-container"
    });
  }

  addFeatureLayers() {
    this.monumentsLayer = new FeatureLayer({
      url: "https://services7.arcgis.com/xN1YpHdP6PeZuK0R/arcgis/rest/services/historical_data_dude/FeatureServer/0",
      outFields: ["*"]
    });

    this.map.add(this.graphicsLayerRoutes);
    this.map.add(this.monumentsLayer);
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
    if (!this.view) return;

    const searchWidget = new Search({
      view: this.view,
      includeDefaultSources: true,
      locationEnabled: true,
      popupEnabled: true,
      container: 'my-search-container'
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
      size: '10px',
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
    if (!this.view) return;

    const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

    this.view.on("click", (event) => {
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
      size: '10px',
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

  async showDirections(features: any[]) {
    // Guard clause
    if (!this.view) return;
    if (this.directionsElement) {
      this.directionsElement.remove();
    }

    this.directionsElement = document.createElement("ol");
    this.directionsElement.classList.add(
      "esri-widget",
      "esri-widget--panel",
      "esri-directions__scroller"
    );
    this.directionsElement.style.height = "550px";
    this.directionsElement.style.width = "100%";

    this.directionsElement.style.position = "static";
    this.directionsElement.style.overflowY = "auto";
    this.directionsElement.style.margin = '102px auto';

    this.directionsElement.style.border = "3px solid black";
    this.directionsElement.style.borderRadius = "4px";
    this.directionsElement.style.padding = "15px 15px 15px 30px";
    this.directionsElement.style.boxSizing = "border-box";
    this.directionsElement.style.position = "absolute";
    this.directionsElement.style.top = "520px";

    let totalDistance: number = 0;
    let numberOfBuildings: number = 3;
    let userId = await this.authService.getId();

    features.forEach((result) => {
      const direction = document.createElement("li");
      const distKm = (result.attributes.length * 1.609).toFixed(2);
      direction.innerHTML = `${result.attributes.text} (${distKm} km)`;
      totalDistance += +distKm;
      this.directionsElement.appendChild(direction);
    });

    this.view.ui.empty("bottom-right");
    this.view.ui.add(this.directionsElement, "top-right");

    try {
      const savingItineraryUrl = "http://localhost:3000/api/reviews/itineraries/save";
      const savingResult = await axios.post(savingItineraryUrl, {
        distance: totalDistance,
        userId,
        numberOfBuildings,
        ranking: 1,
        optionBased: ""
      });

      const itineraryBuildingInsertionUrl = "http://localhost:3000/api/reviews/itinerary-building/insert";

      console.log(this.userMonuments);
      console.log(this.itineraryBuildingsNames);

      const insertionPromises = this.itineraryBuildingsNames.map(name => {
        const buildings: Monument[] = this.userMonuments.filter(building => building.name === name);

        console.log(buildings[0]);
        return axios.post(itineraryBuildingInsertionUrl, {
          buildingId: buildings[0].buildingId,
          itineraryId: savingResult.data.insertId
        }, { withCredentials: true });
      })


      const result = await Promise.all(insertionPromises);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  ngOnDestroy() {
    if (this.view) {
      this.view.container = null;
      //this.view.destroy();
    }
  }
}
