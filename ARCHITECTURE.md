# Brews and Bytes Architecture & Data Flow

This document presents Mermaid diagrams illustrating the information and data flow across the Brews and Bytes project.

## 1. System Overview

```mermaid
flowchart LR
  subgraph Data_Sources
    data_js[data.js]
    spots_data[spots-data.js]
    mock_spots[mock-data-spots.js]
    mock_map[mock-map-data.js]
    mock_heatmap[mock-heatmap.js]
    geo_places[geo-places.js]
    spot_card[spot-card.js]
    map_impl[map-implementation.js]
    place_card[place-card.js]
    connector[spot-place-card-connector.js]
  end

  data_js --> geo_places
  spots_data --> spot_card
  mock_spots --> map_impl
  mock_map --> map_impl
  mock_heatmap --> place_card
  map_impl --> connector
  spot_card --> connector
  connector --> place_card

  subgraph Core_Components
    geo_places
    spot_card
    map_impl
    connector
    place_card
  end

  subgraph Utilities_and_Scripts
    form_validation[form-validation.js]
    rating_widgets[rating-widgets.js]
    main_script[script.js]
  end

  main_script --> geo_places
```

## 2. User Interaction & Data Flow
```mermaid
sequenceDiagram
  participant U as User
  participant M as Map
  participant SP as SpotCard
  participant C as Connector
  participant PC as PlaceCard

  U->>M: click map marker
  M->>C: marker event
  C->>PC: openSpotDetail(id)
  PC->>PC: convertPlaceCardData()
  PC->>PC: populateDetailsCard(data)
  PC->>PC: generateHeatmap(id, metric)
  PC->>PC: generateRadarChart()
  PC-->>U: render overlay
  U->>PC: click metric button
  PC->>PC: regenerate heatmap
```

## 3. Data Model Flow
```mermaid
flowchart TD
  Places[(places)] --> Metrics[(metrics)]
  Metrics --> Detail[(metric_details)]
  Places --> Tribes[(tribes)]
  Tribes --> PlaceTribes[(place_tribes)]
  Places --> Reviews[(reviews)]
  Places --> HeatmapData[(heatmap_data)]
```
