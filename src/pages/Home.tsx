import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Paper,
} from '@mui/material';
import {
  Hotel as HotelIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Home: React.FC = () => {
  const features = [
    {
      icon: <HotelIcon sx={{ fontSize: 40 }} />,
      title: '探索飯店',
      description: '瀏覽精選的豪華飯店，找到完美的住宿選擇',
    },
    {
      icon: <SearchIcon sx={{ fontSize: 40 }} />,
      title: '智能搜尋',
      description: '根據地點、價格和設施快速找到理想飯店',
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 40 }} />,
      title: '收藏功能',
      description: '保存喜愛的飯店，隨時查看和比較',
    },
    {
      icon: <MessageIcon sx={{ fontSize: 40 }} />,
      title: '即時諮詢',
      description: '與我們的專業團隊直接溝通，獲得最佳建議',
    },
  ];

  const sampleHotels = [
    {
      id: '1',
      name: '台北大飯店',
      location: '台北, 台灣',
      price: 3000,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    },
    {
      id: '2',
      name: '高雄海景飯店',
      location: '高雄, 台灣',
      price: 2500,
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
    },
    {
      id: '3',
      name: '台中精品飯店',
      location: '台中, 台灣',
      price: 2000,
      rating: 4.0,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: 'white',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.3)',
          }}
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 50%' } }}>
            <Box
              sx={{
                position: 'relative',
                p: { xs: 3, md: 6 },
                pr: { md: 0 },
              }}
            >
              <Typography variant="h3" component="h1" gutterBottom>
                探索世界的美好
              </Typography>
              <Typography variant="h5" paragraph>
                在 Wanderlust Travel，我們致力於為您提供最優質的旅遊體驗。
                從豪華飯店到精品住宿，我們有您需要的所有選擇。
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/hotels"
                  sx={{ mr: 2, mb: 2 }}
                >
                  開始探索
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={RouterLink}
                  to="/register"
                  sx={{ mb: 2 }}
                >
                  立即註冊
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          為什麼選擇我們
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          {features.map((feature, index) => (
            <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 calc(50% - 8px)', md: '0 0 calc(25% - 6px)' } }} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 2,
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <CardContent>
                  <Typography gutterBottom variant="h6" component="h3">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Sample Hotels Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          精選飯店
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          {sampleHotels.map((hotel) => (
            <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 calc(50% - 8px)', md: '0 0 calc(33.333% - 5.33px)' } }} key={hotel.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={hotel.image}
                  alt={hotel.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {hotel.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {hotel.location}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary">
                      NT$ {hotel.price.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ⭐ {hotel.rating}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/hotels"
          >
            查看更多飯店
          </Button>
        </Box>
      </Container>

      {/* CTA Section */}
      <Paper sx={{ bgcolor: 'primary.main', color: 'white', py: 6 }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            準備好開始您的旅程了嗎？
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            立即註冊帳號，享受專屬優惠和個人化服務
          </Typography>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              component={RouterLink}
              to="/register"
              sx={{ bgcolor: 'white', color: 'primary.main', mr: 2 }}
            >
              立即註冊
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={RouterLink}
              to="/login"
              sx={{ color: 'white', borderColor: 'white' }}
            >
              登入帳號
            </Button>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default Home; 