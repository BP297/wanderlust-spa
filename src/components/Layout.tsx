import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Hotel as HotelIcon,
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  Message as MessageIcon,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: '首頁', path: '/', icon: <HotelIcon /> },
    { label: '飯店', path: '/hotels', icon: <HotelIcon /> },
    ...(user ? [
      { label: '收藏', path: '/favorites', icon: <FavoriteIcon /> },
      { label: '訊息', path: '/messages', icon: <MessageIcon /> },
      { label: '個人資料', path: '/profile', icon: <PersonIcon /> },
    ] : []),
    ...(user?.role === 'operator' ? [
      { label: '管理面板', path: '/dashboard', icon: <DashboardIcon /> },
    ] : []),
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold',
            }}
          >
            Wanderlust Travel
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                onClick={handleMobileMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={mobileMenuAnchor}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleMenuClose}
              >
                {navItems.map((item) => (
                  <MenuItem
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    onClick={handleMenuClose}
                    selected={isActive(item.path)}
                  >
                    {item.icon}
                    <Typography sx={{ ml: 1 }}>{item.label}</Typography>
                  </MenuItem>
                ))}
                {user ? (
                  <MenuItem onClick={handleLogout}>
                    <Typography>登出</Typography>
                  </MenuItem>
                ) : (
                  <MenuItem
                    component={RouterLink}
                    to="/login"
                    onClick={handleMenuClose}
                  >
                    <Typography>登入</Typography>
                  </MenuItem>
                )}
              </Menu>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    color="inherit"
                    startIcon={item.icon}
                    sx={{
                      backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>

              {user ? (
                <>
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{ ml: 2 }}
                  >
                    <Avatar
                      src={user.profilePhoto}
                      sx={{ width: 32, height: 32 }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem
                      component={RouterLink}
                      to="/profile"
                      onClick={handleMenuClose}
                    >
                      個人資料
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      登出
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    color="inherit"
                    variant="outlined"
                  >
                    登入
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    color="inherit"
                    variant="contained"
                  >
                    註冊
                  </Button>
                </Box>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 Wanderlust Travel. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 