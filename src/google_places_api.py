import marimo

__generated_with = "0.11.17"
app = marimo.App(width="medium")


@app.cell
def _():
    import json
    return (json,)


@app.cell
def _():
    bootleggers_coord_x = -34.082105713981006
    bootleggers_coord_y = 18.851893312815577
    return bootleggers_coord_x, bootleggers_coord_y


@app.cell
def _():
    API_KEY = "AIzaSyDPEBZvSbVV6imnrW36PuyCJP5LbJDH1IM"
    return (API_KEY,)


app._unparsable_cell(
    r"""
    async function fetchNearbyRestaurants(lat, lng) {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=2000&type=restaurant&key=YOUR_API_KEY`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === \"OK\") {
            return data.results; // Array of restaurant objects
        } else {
            console.error(\"API Error:\", data.status);
            return [];
        }
    }
    """,
    name="_"
)


@app.cell
def _():
    import requests
    return (requests,)


@app.cell
def _(API_KEY, bootleggers_coord_x, bootleggers_coord_y, requests):
    url_base = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={bootleggers_coord_x},{bootleggers_coord_y}&radius=100&type=cafe&key={API_KEY}"

    response = requests.get(url_base)
    return response, url_base


@app.cell
def _(response):
    response.json()
    return


@app.cell
def _():
    # Parse the response into list:


    return


@app.cell
def _():
    return


@app.cell
def _():
    return


@app.cell
def _():
    return


@app.cell
def _():
    import duckdb 

    conn = duckdb.connect("locations.db")

    conn.sql("""CREATE TABLE locations (
    id TEXT,
    name TEXT, 
    place_id TEXT,
    lat FLOAT,
    long FLOAT,
    address TEXT,
    city TEXT,
    created_at TIMESTAMP)
    """)
    return conn, duckdb


@app.cell
def _():
    starting_lst = [
        "Vida WaterStone",
        "Bootleggers",
        "Virgin Active Waterstone",
        "MuggnBean Somerset Mall",
        "MuggnBean Somerset West",
        "Plato Coffee",
        "Merkava Coffee Roastery",
        "Spoon Bakery And Eatery",
        "The Coffee Roasting Company",
        "Babette's Bakery and Eatery",
        "Sage & Thyme Village Coffee Shop",
        "Cafe 1865",
        "SCHOON Bright Street Café",
        "The Modelist",
        "PlaaslikLocal",
        "Bossa",
        "Haven Art Cafe",
        "Locomotion Coffeatery",
        "Coffee Couture Vergelegen"
    ]
    return (starting_lst,)


@app.cell
def _(API_KEY, conn, requests):
    import os
    from datetime import datetime, timezone

    def get_place_coordinates(place_name):
        params = {
            "query": place_name,
            "key": API_KEY
        }
    
        # Make the Text Search request
        response = requests.get(TEXT_SEARCH_URL, params=params)
        data = response.json()
        print(data)
        # Check if request was successful and results exist
        if data["status"] == "OK" and data["results"]:
            result = data["results"][0]  # Take the top result
            return {
                "name": result["name"],
                "address": result["formatted_address"],
                "place_id": result["place_id"],
                "lat": result["geometry"]["location"]["lat"],
                "lng": result["geometry"]["location"]["lng"]
            }
        else:
            print(f"Error: {data['status']} - {data.get('error_message', 'No results found')}")
            return None
        
    LOCATION = "Somerset West"
    PLACE_NAME = "Coffee Couture Vergelegen"
    # API endpoint for Text Search
    TEXT_SEARCH_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json"

    print(f"Searching for '{PLACE_NAME} in {LOCATION}'...\n")
    result = get_place_coordinates(PLACE_NAME + " " + LOCATION)

    if result:
        print(f"Found {PLACE_NAME}:")
        print(f"Name: {result['name']}")
        print(f"Address: {result['address']}")
        print(f"Place ID: {result['place_id']}")
        print(f"Coordinates: ({result['lat']}, {result['lng']})")
    else:
        print(f"Couldn’t find {PLACE_NAME}—check the name or API key!")

    root_dir = r"C:\Users\jdc\Documents\GithubPersonal\jdc.code.brewsandbytes\src\locations"

    query = """
        INSERT INTO locations (id, name, place_id, lat, long, address, city, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """

    values = (
        result.get("place_id"),
        result.get("name"),
        result.get("place_id"),
        result.get("lat"),
        result.get("lng"),
        result.get("address"),
        LOCATION,  # Assuming LOCATION is a valid variable
        datetime.now(timezone.utc),
    )

    conn.execute(query, values)
    return (
        LOCATION,
        PLACE_NAME,
        TEXT_SEARCH_URL,
        datetime,
        get_place_coordinates,
        os,
        query,
        result,
        root_dir,
        timezone,
        values,
    )


@app.cell
def _(conn, locations, mo):
    _df = mo.sql(
        f"""
        SELECT * FROM locations;
        """,
        engine=conn
    )
    return


@app.cell
def _(mo):
    mo.md(""" """)
    return


@app.cell
def _():
    import marimo as mo
    return (mo,)


if __name__ == "__main__":
    app.run()
