import type { MetaFunction } from "@remix-run/node";
    import { Link } from "@remix-run/react"; // Import Link for navigation
    import { Button, Box, Typography, Paper } from '@mui/material'; // Import MUI components

    export const meta: MetaFunction = () => {
      return [
        { title: "Oru Kozhikkodan Date" }, // Updated title
        { name: "description", content: "Find your match in Kozhikode!" }, // Updated description
      ];
    };

    export default function Index() {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column', // Stack items vertically
            minHeight: '100vh', // Full viewport height
            alignItems: 'center', // Center horizontally
            justifyContent: 'center', // Center vertically
            textAlign: 'center',
            p: 3, // Add padding
            // Add a subtle background gradient or image later if desired
            // background: 'linear-gradient(to bottom, #f0f4f8, #d9e2ec)',
          }}
        >
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 'sm' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Oru Kozhikkodan Date
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Your journey to finding a connection starts here.
            </Typography>

            {/* Add navigation buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                component={Link} // Use Remix Link
                to="/register" // Link to the registration page
                variant="contained"
                color="primary"
                size="large"
              >
                Register Now
              </Button>
              <Button
                component={Link}
                to="/browse" // Link to profile browsing (to be created)
                variant="outlined"
                color="secondary"
                size="large"
                disabled // Disable until implemented
              >
                Browse Profiles
              </Button>
               <Button
                component={Link}
                to="/admin" // Link to admin panel (to be created)
                variant="text"
                size="large"
                disabled // Disable until implemented
              >
                Admin Login
              </Button>
            </Box>
          </Paper>

          {/* You can add a footer or other elements here later */}
          <Typography variant="caption" sx={{ mt: 4, color: 'text.disabled' }}>
            © {new Date().getFullYear()} Oru Kozhikkodan Date
          </Typography>
        </Box>
      );
    }