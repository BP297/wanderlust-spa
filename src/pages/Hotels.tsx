import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Rating,
  Chip,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search as SearchIcon, LocationOn as LocationIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { hotelAPI } from '../services/api';
import { Hotel } from '../types';

const Hotels: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchHotels();
  }, [search, location, maxPrice, page]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 12,
      };
      
      if (search) params.search = search;
      if (location) params.location = location;
      if (maxPrice) params.maxPrice = parseInt(maxPrice);

      const response = await hotelAPI.getHotels(params);
      
      if (response.success && response.data) {
        setHotels(response.data.data);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (err) {
      setError('載入飯店資料失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 3 }}>
        探索飯店
      </Typography>

      {/* Search Form */}
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 calc(33.333% - 5.33px)' } }}>
            <TextField
              fullWidth
              label="搜尋飯店"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 calc(25% - 6px)' } }}>
            <TextField
              fullWidth
              label="地點"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              InputProps={{
                startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 calc(25% - 6px)' } }}>
            <TextField
              fullWidth
              label="最高價格"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 calc(16.667% - 8px)' } }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
            >
              搜尋
            </Button>
          </Box>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Hotels Grid */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {hotels.map((hotel) => (
          <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 calc(50% - 8px)', md: '0 0 calc(33.333% - 5.33px)' } }} key={hotel._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease-in-out',
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={hotel.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}
                alt={hotel.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h3">
                  {hotel.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {hotel.location}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {hotel.description.substring(0, 100)}...
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={hotel.rating} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {hotel.rating}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {hotel.amenities.slice(0, 3).map((amenity, index) => (
                    <Chip key={index} label={amenity} size="small" />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary">
                    NT$ {hotel.price.toLocaleString()}
                  </Typography>
                  <Button
                    component={RouterLink}
                    to={`/hotels/${hotel._id}`}
                    variant="outlined"
                    size="small"
                  >
                    查看詳情
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {hotels.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            沒有找到符合條件的飯店
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Hotels; 