import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Alert,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Hotel as HotelIcon,
  People as PeopleIcon,
  Message as MessageIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { hotelAPI } from '../services/api';
import { Hotel } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [hotelForm, setHotelForm] = useState({
    name: '',
    description: '',
    location: '',
    price: '',
    rating: '',
    amenities: '',
    isAvailable: true,
  });

  useEffect(() => {
    if (user?.role === 'operator') {
      fetchHotels();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await hotelAPI.getHotels({ limit: 100 });
      if (response.success && response.data) {
        setHotels(response.data.data);
      }
    } catch (err) {
      setError('載入飯店資料失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHotel = () => {
    setEditingHotel(null);
    setHotelForm({
      name: '',
      description: '',
      location: '',
      price: '',
      rating: '',
      amenities: '',
      isAvailable: true,
    });
    setOpenDialog(true);
  };

  const handleEditHotel = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setHotelForm({
      name: hotel.name,
      description: hotel.description,
      location: hotel.location,
      price: hotel.price.toString(),
      rating: hotel.rating.toString(),
      amenities: hotel.amenities.join(', '),
      isAvailable: hotel.isAvailable,
    });
    setOpenDialog(true);
  };

  const handleDeleteHotel = async (hotelId: string) => {
    if (window.confirm('確定要刪除此飯店嗎？')) {
      try {
        const response = await hotelAPI.deleteHotel(hotelId);
        if (response.success) {
          fetchHotels();
        }
      } catch (err) {
        setError('刪除飯店失敗');
      }
    }
  };

  const handleSaveHotel = async () => {
    if (!hotelForm.name || !hotelForm.description || !hotelForm.location || !hotelForm.price) {
      setError('請填寫所有必要欄位');
      return;
    }

    try {
      const hotelData = {
        name: hotelForm.name,
        description: hotelForm.description,
        location: hotelForm.location,
        price: parseInt(hotelForm.price),
        rating: parseFloat(hotelForm.rating) || 0,
        amenities: hotelForm.amenities.split(',').map(item => item.trim()).filter(Boolean),
        isAvailable: hotelForm.isAvailable,
        images: [],
      };

      if (editingHotel) {
        await hotelAPI.updateHotel(editingHotel._id, hotelData);
      } else {
        await hotelAPI.createHotel(hotelData);
      }

      setOpenDialog(false);
      fetchHotels();
    } catch (err) {
      setError('儲存飯店失敗');
    }
  };

  const stats = {
    totalHotels: hotels.length,
    availableHotels: hotels.filter(h => h.isAvailable).length,
    averageRating: hotels.length > 0 
      ? (hotels.reduce((sum, h) => sum + h.rating, 0) / hotels.length).toFixed(1)
      : '0.0',
    totalRevenue: hotels.reduce((sum, h) => sum + h.price, 0).toLocaleString(),
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

  if (user?.role !== 'operator') {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          您沒有權限訪問管理面板
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            管理面板
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddHotel}
          >
            新增飯店
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* 統計卡片 */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
          <Card sx={{ flex: { xs: '1 1 100%', sm: '0 0 calc(25% - 6px)' } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <HotelIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.totalHotels}</Typography>
                  <Typography variant="body2" color="text.secondary">總飯店數</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: { xs: '1 1 100%', sm: '0 0 calc(25% - 6px)' } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.availableHotels}</Typography>
                  <Typography variant="body2" color="text.secondary">可預訂飯店</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: { xs: '1 1 100%', sm: '0 0 calc(25% - 6px)' } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MessageIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.averageRating}</Typography>
                  <Typography variant="body2" color="text.secondary">平均評分</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: { xs: '1 1 100%', sm: '0 0 calc(25% - 6px)' } }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">NT$ {stats.totalRevenue}</Typography>
                  <Typography variant="body2" color="text.secondary">總價值</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* 飯店列表 */}
        <Paper>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">飯店管理</Typography>
          </Box>
          <List>
            {hotels.map((hotel) => (
              <ListItem key={hotel._id} divider>
                <ListItemAvatar>
                  <Avatar>
                    <HotelIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={hotel.name}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {hotel.location} • NT$ {hotel.price.toLocaleString()} • ⭐ {hotel.rating}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {hotel.description.substring(0, 100)}...
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={hotel.isAvailable ? '可預訂' : '不可預訂'}
                          color={hotel.isAvailable ? 'success' : 'error'}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        {hotel.amenities.slice(0, 3).map((amenity, index) => (
                          <Chip key={index} label={amenity} size="small" variant="outlined" sx={{ mr: 0.5 }} />
                        ))}
                      </Box>
                    </Box>
                  }
                />
                <Box>
                  <Tooltip title="編輯">
                    <IconButton onClick={() => handleEditHotel(hotel)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="刪除">
                    <IconButton onClick={() => handleDeleteHotel(hotel._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      {/* 新增/編輯飯店對話框 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingHotel ? '編輯飯店' : '新增飯店'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="飯店名稱"
              value={hotelForm.name}
              onChange={(e) => setHotelForm(prev => ({ ...prev, name: e.target.value }))}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="地點"
              value={hotelForm.location}
              onChange={(e) => setHotelForm(prev => ({ ...prev, location: e.target.value }))}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="價格"
              type="number"
              value={hotelForm.price}
              onChange={(e) => setHotelForm(prev => ({ ...prev, price: e.target.value }))}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="評分"
              type="number"
              inputProps={{ step: 0.1, min: 0, max: 5 }}
              value={hotelForm.rating}
              onChange={(e) => setHotelForm(prev => ({ ...prev, rating: e.target.value }))}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="設施 (用逗號分隔)"
              value={hotelForm.amenities}
              onChange={(e) => setHotelForm(prev => ({ ...prev, amenities: e.target.value }))}
              helperText="例如: WiFi, 游泳池, 健身房"
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="描述"
              multiline
              rows={4}
              value={hotelForm.description}
              onChange={(e) => setHotelForm(prev => ({ ...prev, description: e.target.value }))}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth>
              <InputLabel>狀態</InputLabel>
              <Select
                value={hotelForm.isAvailable}
                label="狀態"
                onChange={(e) => setHotelForm(prev => ({ ...prev, isAvailable: e.target.value as boolean }))}
              >
                <MenuItem value="true">可預訂</MenuItem>
                <MenuItem value="false">不可預訂</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button onClick={handleSaveHotel} variant="contained">
            {editingHotel ? '更新' : '新增'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 