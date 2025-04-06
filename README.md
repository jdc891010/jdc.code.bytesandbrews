# Brews and Bytes

A web application for finding optimal remote work locations in Somerset West, South Africa. Brews and Bytes helps remote workers, freelancers, and digital nomads discover the perfect cafes and workspaces based on internet speed, ambiance, noise levels, and parking availability.

![Brews and Bytes](https://placeholder-for-screenshot.com/brewsandbytes-screenshot.png)

## Features

- **Interactive Map**: Locate and explore workspaces across Somerset West
- **Detailed Metrics**: Compare locations based on:
  - Internet Speed (Mbps)
  - Vibe/Ambiance (1-5 scale)
  - Noise Level (1-5 scale)
  - Parking Availability (1-5 scale)
- **Data Visualization**:
  - Heatmaps showing best times to visit
  - Box plots for statistical distribution of metrics
  - Weekly and monthly trend graphs
- **Tribe System**: Find locations popular among different professional groups:
  - Code Conjurers (Developers)
  - Word Weavers (Writers)
  - Pixel Pixies (Designers)
  - Buzz Beasts (Marketers/Social Media)
  - Data Diviners (Analysts/Data Scientists)
- **Integrated Speed Test**: Test and contribute internet speed data
- **Accessibility Information**: Filter locations based on handicapped facilities
- **Community Reviews**: Read and contribute comments from other users

## Technology Stack

### Frontend
- HTML5, CSS3, JavaScript
- D3.js for data visualization
- Google Maps API for location mapping

### Backend
- Node.js with Express
- Environment variables for API key management

### Data Analysis
- Python 3.12+
- Libraries: pandas, geopandas, duckdb, pyarrow, marimo

## Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Python 3.12+
- Google Maps API key

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/brewsandbytes.git
   cd brewsandbytes
   ```

2. Set up the backend
   ```bash
   cd website
   npm install
   ```

3. Create a `.env` file in the website directory with your Google Maps API key:
   ```
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. Set up the Python environment (for data analysis tools)
   ```bash
   # From the project root
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install -e .
   ```

## Running the Application

### Development Mode
```bash
cd website
npm run dev
```
The application will be available at http://localhost:3000

### Production Mode
```bash
cd website
npm start
```

## Project Structure

```
brewsandbytes/
├── .venv/                  # Python virtual environment
├── ookla/                  # Speedtest data analysis
├── src/                    # Python source code for data processing
├── tools/                  # Utility scripts
├── website/                # Web application
│   ├── data_models/        # Data structure definitions
│   ├── public/             # Static assets and frontend code
│   │   ├── *.js            # JavaScript modules
│   │   ├── *.css           # Stylesheets
│   │   └── index.html      # Main HTML file
│   ├── .env                # Environment variables (not in repo)
│   ├── package.json        # Node.js dependencies
│   └── server.js           # Express server
├── .gitignore              # Git ignore file
├── pyproject.toml          # Python project configuration
└── README.md               # This file
```

## Contributing

We welcome contributions to Brews and Bytes! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Data Contributions

You can contribute to our dataset by:
- Using the integrated speed test at various locations
- Submitting reviews and ratings for workspaces
- Suggesting new locations to add to the map

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Coffee shops of Somerset West for providing workspaces
- The remote working community for inspiration and feedback
- All contributors who have helped improve this application
