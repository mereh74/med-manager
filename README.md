# 🏥 Medication Management System

A modern, responsive web application for healthcare providers to manage patient medications, schedules, and administration records. Built with React and TypeScript, this application provides an intuitive interface for tracking medication adherence and patient care.

## ✨ Features

### 🧑‍⚕️ Patient Management

- **Patient Profiles**: Complete patient information management
- **Patient List**: Patient directory
- **Patient Context**: Global state management for current patient

### 💊 Medication Management

- **Medication Creation**: Add new medications with detailed specifications
- **Medication List**: View all medications for a specific patient
- **Active/Inactive Status**: Toggle medication status to track current prescriptions
- **Bulk Operations**: Efficiently manage multiple medications

### 📅 Schedule Management

- **Medication Schedules**: Create recurring medication schedules
- **Calendar View**: Visual calendar showing upcoming doses for the next two weeks
- **Bulk Schedule Creation**: Set up multiple schedules for one medication
- **Day/Time Configuration**: Flexible scheduling with multiple days and times

### 💉 Administration Tracking

- **Dose Administration**: Record when medications are actually taken
- **Administration History**: Track all medication administrations
- **Adherence Monitoring**: Monitor patient compliance with medication schedules
- **Notes & Documentation**: Add detailed notes for each administration

### 🔄 Real-time Updates

- **Optimistic Updates**: Immediate UI feedback for better user experience
- **Cache Management**: Intelligent data caching and synchronization
- **Offline Support**: Graceful handling of network interruptions

## 🛠️ Tech Stack

### **Frontend Framework**

- **React 19** - Latest React with modern hooks and concurrent features
- **TypeScript** - Type-safe development with excellent IDE support

### **State Management & Data Fetching**

- **TanStack Query (React Query)** - Powerful data synchronization library
  - **Automatic Caching**: Intelligent caching reduces API calls and improves performance
  - **Background Updates**: Data stays fresh with automatic background refetching
  - **Optimistic Updates**: Immediate UI feedback while API calls are in progress
  - **Error Handling**: Built-in error boundaries and retry mechanisms
  - **Offline Support**: Graceful degradation when network is unavailable
  - **Real-time Sync**: Automatic data synchronization across components

### **Routing & Navigation**

- **React Router 7** - Modern client-side routing solution
  - **Type-safe Routes**: TypeScript integration for route definitions
  - **Nested Routing**: Organized route structure for complex applications
  - **Programmatic Navigation**: Dynamic routing based on user actions
  - **Route Guards**: Protected routes and authentication handling
  - **Deep Linking**: Direct access to specific application states

### **Styling & UI**

- **Styled Components** - CSS-in-JS styling solution
  - **Component-based Styling**: Styles are co-located with components
  - **Dynamic Styling**: Runtime style changes based on props and state
  - **Theme Support**: Consistent design system with theme variables
  - **CSS-in-JS Benefits**: No CSS conflicts, better maintainability
  - **Responsive Design**: Mobile-first approach with breakpoint utilities

### **Build Tools**

- **Vite** - Lightning-fast build tool and development server
- **ESLint** - Code quality and consistency enforcement
- **Vitest** - Fast unit testing framework

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd med-management
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Request the API base URL and API key from the administrator
   Create a `.env` file in the root directory:

   ```env
   VITE_API_BASE_URL=http://localhost:3000
   VITE_API_KEY=your-api-key-here
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
med-management/
├── src/
│   ├── api/                 # API endpoints and client configuration
│   ├── components/          # Reusable UI components
│   ├── contexts/            # React Context providers
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── providers/           # App-level providers
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   └── test/                # Test setup and utilities
├── public/                  # Static assets
├── vitest.config.ts         # Test configuration
└── package.json             # Dependencies and scripts
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm run test:run

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Coverage

- **Component Tests**: UI component behavior and interactions
- **Hook Tests**: Custom hook logic and state management
- **Context Tests**: Context provider functionality
- **Integration Tests**: Component integration and data flow

## 🏗️ Build & Deployment

### Development Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Production Deployment

The application builds to static files that can be deployed to any static hosting service:

- Vercel
- Netlify
- AWS S3
- GitHub Pages

## 🔧 Configuration

### Environment Variables

- `VITE_API_BASE_URL`: Backend API base URL
- `VITE_API_KEY`: Authentication key for API access

### API Configuration

The application is configured to work with a RESTful backend API. Ensure your backend provides the following endpoints:

- `GET /patients` - Retrieve patient list
- `POST /medications` - Create new medication
- `PUT /medications/:id` - Update medication
- `GET /patients/:id/medications` - Get patient medications
- `POST /medication-schedules/bulk` - Create medication schedules
- `GET /patients/:id/medication-schedules` - Get patient schedules
- `POST /medication-administrations` - Record medication administration

## 🎨 Design Principles

### **Accessibility First**

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility

### **Responsive Design**

- Mobile-first approach
- Flexible grid layouts
- Adaptive typography
- Touch-friendly interactions

### **User Experience**

- Intuitive navigation
- Clear visual hierarchy
- Consistent interaction patterns
- Helpful error messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **TanStack** for the powerful Query library
- **React Router** for seamless navigation
- **Styled Components** for elegant styling solutions

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ for better healthcare management**
