import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Avatar,
  Alert,
  Divider,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { authAPI, uploadAPI } from '../services/api';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const response = await authAPI.updateProfile(formData);
      
      if (response.success) {
        setSuccess('個人資料更新成功');
      } else {
        setError(response.message || '更新失敗');
      }
    } catch (err) {
      setError('更新失敗');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const response = await uploadAPI.uploadProfilePhoto(file);
      
      if (response.success) {
        setSuccess('頭像上傳成功');
        // 重新載入用戶資料
        window.location.reload();
      } else {
        setError(response.message || '上傳失敗');
      }
    } catch (err) {
      setError('上傳失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          個人資料
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 4 }}>
          {/* Profile Photo */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar
              src={user?.profilePhoto}
              sx={{ width: 100, height: 100, mr: 3 }}
            >
              {user?.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" gutterBottom>
                個人頭像
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="photo-upload"
                type="file"
                onChange={handlePhotoUpload}
              />
              <label htmlFor="photo-upload">
                <Button variant="outlined" component="span" disabled={loading}>
                  上傳新頭像
                </Button>
              </label>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Profile Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="姓名"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="電子郵件"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                角色：{user?.role === 'operator' ? '員工' : '一般用戶'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                註冊時間：{new Date(user?.createdAt || '').toLocaleDateString()}
              </Typography>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? '更新中...' : '更新資料'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile; 