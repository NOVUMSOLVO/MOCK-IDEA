# MOCK IDEA AI Service

Advanced AI-powered logo analysis and image processing service for the MOCK IDEA platform.

## Features

- **Logo Analysis**: Style detection, complexity analysis, text detection
- **Smart Recommendations**: Template category suggestions based on logo characteristics
- **Image Enhancement**: Upscaling, background removal, color adjustment
- **Placement Optimization**: AI-powered positioning recommendations

## Quick Start

### Prerequisites

- Python 3.11+
- pip or conda

### Installation

1. **Clone and navigate to the AI service directory:**
   ```bash
   cd ai-service
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run the service:**
   ```bash
   python main.py
   ```

The service will be available at `http://localhost:8000`

### Docker Setup

1. **Build and run with Docker:**
   ```bash
   docker-compose up --build
   ```

2. **Or run with Docker directly:**
   ```bash
   docker build -t mock-idea-ai .
   docker run -p 8000:8000 mock-idea-ai
   ```

## API Endpoints

### POST /analyze-logo

Analyze a logo image and provide insights.

**Request:**
```json
{
  "image": "base64_encoded_image",
  "colors": [
    {
      "name": "Blue",
      "hex": "#0066CC",
      "rgb": [0, 102, 204],
      "population": 1500
    }
  ]
}
```

**Response:**
```json
{
  "style": "modern",
  "complexity": 3,
  "hasText": false,
  "recommendedCategories": ["business", "digital", "tech"],
  "dominantColors": ["#0066CC", "#FFFFFF"],
  "placement": {
    "preferredPosition": "center",
    "scaleRange": [0.2, 0.8],
    "rotationTolerance": 15
  }
}
```

### POST /enhance-image

Apply enhancements to an image.

**Request:**
```json
{
  "image": "base64_encoded_image",
  "enhancements": {
    "upscale": true,
    "removeBackground": false,
    "adjustColors": true
  }
}
```

**Response:**
```json
{
  "image": "base64_encoded_enhanced_image"
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "ai-analysis",
  "version": "1.0.0"
}
```

## Integration with MOCK IDEA Backend

The AI service integrates with your Node.js backend through the `aiService.ts` module. Make sure to:

1. **Set the AI service URL** in your backend environment:
   ```bash
   AI_SERVICE_URL=http://localhost:8000
   AI_SERVICE_TOKEN=your_optional_auth_token
   ```

2. **The backend will automatically call** the AI service when:
   - A logo is uploaded (for analysis)
   - Image enhancement is requested
   - Advanced mockup generation is needed

## Development

### Adding New Analysis Features

1. **Create new analysis functions** in `main.py`
2. **Add new endpoints** following the existing pattern
3. **Update the response models** in Pydantic classes
4. **Test with the provided examples**

### Performance Optimization

- **Model caching**: Pre-trained models are cached in the `models/` directory
- **Image preprocessing**: Images are automatically resized for optimal processing
- **Async processing**: All endpoints support async operations

## Troubleshooting

### Common Issues

1. **OpenCV installation issues:**
   ```bash
   pip install opencv-python-headless
   ```

2. **Memory issues with large images:**
   - Images are automatically resized to max 2048x2048
   - Adjust `MAX_IMAGE_SIZE` in environment variables

3. **Docker build issues:**
   - Ensure you have enough disk space
   - Try building with `--no-cache` flag

### Logs

Check logs for debugging:
```bash
# Docker logs
docker-compose logs ai-service

# Direct Python logs
python main.py
```

## License

Part of the MOCK IDEA project.
