# 🤖 AI Service Setup Guide

Complete setup guide for the MOCK IDEA AI Service with Python FastAPI.

## 🎯 What This Adds

The AI service provides advanced logo analysis capabilities:

- **Style Detection**: Minimalist, modern, vibrant, detailed, classic
- **Complexity Analysis**: 1-5 scale based on edges and contours
- **Text Detection**: Identifies if logos contain text elements
- **Smart Recommendations**: Template categories based on logo characteristics
- **Placement Optimization**: Positioning and scaling recommendations
- **Image Enhancement**: Upscaling, background removal, color adjustment

## 🚀 Quick Setup

### Option 1: Using the Startup Script (Recommended)

```bash
cd "Documents/MOCK IDEA/ai-service"
./start.sh
```

This will:
- Create virtual environment
- Install all dependencies
- Set up configuration
- Start the service on http://localhost:8000

### Option 2: Manual Setup

```bash
cd "Documents/MOCK IDEA/ai-service"

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env

# Start the service
python main.py
```

### Option 3: Docker Setup

```bash
cd "Documents/MOCK IDEA/ai-service"
docker-compose up --build
```

## 🔧 Configuration

### Backend Integration

Your backend is already configured! The AI service URL is set in:

```bash
# backend/.env
AI_SERVICE_URL="http://localhost:8000"
AI_SERVICE_TOKEN="your-ai-service-token"  # Optional
```

### Environment Variables

Edit `ai-service/.env`:

```bash
AI_SERVICE_PORT=8000
AI_SERVICE_HOST=0.0.0.0
LOG_LEVEL=INFO
MAX_IMAGE_SIZE=10485760  # 10MB
```

## 🧪 Testing the Service

### 1. Health Check

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "ai-analysis",
  "version": "1.0.0"
}
```

### 2. API Documentation

Visit: http://localhost:8000/docs

This provides interactive API documentation where you can test all endpoints.

### 3. Test Logo Analysis

```bash
# Upload a logo through your frontend
# The backend will automatically call the AI service
# Check the logs to see the analysis results
```

## 🔄 Integration Flow

```
Frontend Upload → Backend Logo Route → AI Service Analysis → Database Storage
     ↓                    ↓                    ↓                    ↓
User uploads logo → Node.js processes → Python analyzes → Results saved
```

### Backend Integration Points

1. **Logo Upload** (`backend/src/routes/logos.ts`):
   ```typescript
   // Automatically calls AI service after upload
   const analysis = await analyzeLogoWithAI(imageBuffer, colors);
   ```

2. **AI Service** (`backend/src/services/aiService.ts`):
   ```typescript
   // Makes HTTP calls to Python service
   const response = await axios.post(`${AI_SERVICE_URL}/analyze-logo`, {
     image: base64Image,
     colors: colors
   });
   ```

3. **Fallback Handling**:
   ```typescript
   // If AI service is down, uses fallback analysis
   return {
     style: determineStyleFromColors(colors),
     complexity: calculateComplexity(imageBuffer.length),
     // ... fallback data
   };
   ```

## 📊 AI Analysis Features

### Style Detection

- **Minimalist**: ≤2 colors, high brightness
- **Modern**: ≤3 colors, low edge density
- **Vibrant**: >5 colors
- **Detailed**: High edge density (>30%)
- **Classic**: Default fallback

### Complexity Scoring

- **1 (Very Simple)**: <5% edge density, <3 contours
- **2 (Simple)**: <10% edge density, <5 contours
- **3 (Medium)**: <20% edge density, <10 contours
- **4 (Complex)**: <30% edge density, <20 contours
- **5 (Very Complex)**: >30% edge density, >20 contours

### Template Recommendations

Based on style and complexity:

- **Minimalist** → digital, tech, modern
- **Vibrant** → creative, entertainment, lifestyle
- **Classic** → professional, traditional, corporate
- **Simple logos** → apparel, packaging
- **Complex logos** → stationery, signage

## 🛠 Development

### Adding New Analysis Features

1. **Add new function** in `main.py`:
   ```python
   def analyze_new_feature(img_array: np.ndarray) -> str:
       # Your analysis logic
       return result
   ```

2. **Update the response model**:
   ```python
   class AnalyzeLogoResponse(BaseModel):
       # ... existing fields
       newFeature: str
   ```

3. **Call in main analysis**:
   ```python
   def perform_logo_analysis(img_array, colors):
       # ... existing analysis
       new_feature = analyze_new_feature(img_array)
       
       return AnalyzeLogoResponse(
           # ... existing fields
           newFeature=new_feature
       )
   ```

### Performance Optimization

- **Image preprocessing**: Automatically resized to optimal dimensions
- **Caching**: Results can be cached in Redis
- **Async processing**: All endpoints support async operations
- **Memory management**: Images are processed in chunks for large files

## 🐛 Troubleshooting

### Common Issues

1. **Port 8000 already in use**:
   ```bash
   # Change port in .env
   AI_SERVICE_PORT=8001
   ```

2. **OpenCV installation issues**:
   ```bash
   pip install opencv-python-headless
   ```

3. **Memory issues**:
   ```bash
   # Reduce max image size in .env
   MAX_IMAGE_SIZE=5242880  # 5MB
   ```

4. **Backend can't connect**:
   ```bash
   # Check AI service is running
   curl http://localhost:8000/health
   
   # Check backend environment
   echo $AI_SERVICE_URL
   ```

### Logs

Check AI service logs:
```bash
# Direct Python
python main.py

# Docker
docker-compose logs ai-service
```

Check backend logs for AI service calls:
```bash
cd backend
npm run dev
# Look for "AI analysis" messages
```

## 🚀 Production Deployment

### Docker Production

```bash
# Build production image
docker build -t mock-idea-ai:prod .

# Run with production settings
docker run -d \
  --name mock-idea-ai \
  -p 8000:8000 \
  -e LOG_LEVEL=WARNING \
  mock-idea-ai:prod
```

### Environment Setup

```bash
# Production environment variables
AI_SERVICE_URL="https://your-ai-service.com"
LOG_LEVEL="WARNING"
MAX_WORKERS=8
```

## 🎉 Success!

Once running, you'll have:

✅ **Advanced AI logo analysis**
✅ **Smart template recommendations**
✅ **Automatic style detection**
✅ **Complexity scoring**
✅ **Text detection**
✅ **Image enhancement capabilities**

Your MOCK IDEA platform now has enterprise-level AI capabilities! 🚀
