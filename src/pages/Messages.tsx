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
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Send as SendIcon, Message as MessageIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { messageAPI, hotelAPI } from '../services/api';
import { Message, Hotel } from '../types';

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newMessage, setNewMessage] = useState({
    subject: '',
    content: '',
    hotelId: '',
    type: 'inquiry' as 'inquiry' | 'reply',
  });

  useEffect(() => {
    if (user) {
      fetchMessages();
      fetchHotels();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await messageAPI.getMessages();
      if (response.success && response.data) {
        setMessages(response.data.data);
      }
    } catch (err) {
      setError('載入訊息失敗');
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await hotelAPI.getHotels({ limit: 50 });
      if (response.success && response.data) {
        setHotels(response.data.data);
      }
    } catch (err) {
      console.error('載入飯店失敗:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.subject || !newMessage.content) {
      setError('請填寫所有必要欄位');
      return;
    }

    try {
      const response = await messageAPI.sendMessage(newMessage);
      if (response.success) {
        setOpenDialog(false);
        setNewMessage({ subject: '', content: '', hotelId: '', type: 'inquiry' });
        fetchMessages();
      }
    } catch (err) {
      setError('發送訊息失敗');
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'inquiry': return 'primary';
      case 'reply': return 'secondary';
      case 'notification': return 'info';
      default: return 'default';
    }
  };

  const getMessageTypeText = (type: string) => {
    switch (type) {
      case 'inquiry': return '詢問';
      case 'reply': return '回覆';
      case 'notification': return '通知';
      default: return type;
    }
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
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            訊息中心
          </Typography>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={() => setOpenDialog(true)}
          >
            發送新訊息
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!user ? (
          <Alert severity="info">
            請先登入以查看您的訊息
          </Alert>
        ) : messages.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <MessageIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              您還沒有任何訊息
            </Typography>
            <Button
              variant="contained"
              onClick={() => setOpenDialog(true)}
              sx={{ mt: 2 }}
            >
              發送第一條訊息
            </Button>
          </Paper>
        ) : (
          <List>
            {messages.map((message) => (
              <Card key={message._id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ListItemAvatar>
                        <Avatar>
                          {message.sender.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <Box>
                        <Typography variant="h6">
                          {message.subject}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          來自: {message.sender.name}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        label={getMessageTypeText(message.type)}
                        color={getMessageTypeColor(message.type) as any}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary" display="block">
                        {new Date(message.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {message.hotel && (
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={`相關飯店: ${message.hotel.name}`}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  )}
                  
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {message.content}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {message.isRead ? '已讀' : '未讀'}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setNewMessage({
                          subject: `回覆: ${message.subject}`,
                          content: '',
                          hotelId: message.hotel?._id || '',
                          type: 'reply',
                        });
                        setOpenDialog(true);
                      }}
                    >
                      回覆
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </List>
        )}
      </Box>

      {/* 發送新訊息對話框 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>發送新訊息</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="主旨"
              value={newMessage.subject}
              onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>訊息類型</InputLabel>
              <Select
                value={newMessage.type}
                label="訊息類型"
                onChange={(e) => setNewMessage(prev => ({ ...prev, type: e.target.value as 'inquiry' | 'reply' }))}
              >
                <MenuItem value="inquiry">詢問</MenuItem>
                <MenuItem value="reply">回覆</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>相關飯店 (可選)</InputLabel>
              <Select
                value={newMessage.hotelId}
                label="相關飯店 (可選)"
                onChange={(e) => setNewMessage(prev => ({ ...prev, hotelId: e.target.value }))}
              >
                <MenuItem value="">無</MenuItem>
                {hotels.map((hotel) => (
                  <MenuItem key={hotel._id} value={hotel._id}>
                    {hotel.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="訊息內容"
              multiline
              rows={4}
              value={newMessage.content}
              onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button onClick={handleSendMessage} variant="contained">
            發送
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Messages; 