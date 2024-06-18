import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Button, IconButton ,CssBaseline } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const NotificationPet = () => {
    // Retrieve the current logged-in user's data from local storage
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const userId = user.userId || '';

    const [notifications, setNotifications] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/notifications/pet/${userId}`);
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, [userId]);

    const clearNotifications = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/notifications/pet/${userId}/clear`);
            setNotifications([]);
            setMessage('All notifications cleared successfully');
            setTimeout(() => setMessage(''), 1500);
        } catch (error) {
            console.error('Error clearing notifications:', error);
            setMessage('Failed to clear notifications. Please try again.');
            setTimeout(() => setMessage(''), 1500);
        }
    };

    const deleteNotification = async (nid) => {
        try {
            await axios.delete(`http://localhost:3001/api/notifications/${nid}`);
            setNotifications(notifications.filter(notification => notification.nid !== nid));
            setMessage('Notification deleted successfully');
            setTimeout(() => setMessage(''), 1500);
        } catch (error) {
            console.error('Error deleting notification:', error);
            setMessage('Failed to delete notification. Please try again.');
            setTimeout(() => setMessage(''), 1500);
        }
    };

    return (
        <React.Fragment>
        <CssBaseline />
        <Container maxWidth="lg">
            <Button variant="contained" color="primary" onClick={clearNotifications} style={{ marginTop: '5px' }}>
                Clear All Notifications
            </Button>

            {message && (
                <Typography variant="body1" color="success">
                    {message}
                </Typography>
            )}

            <List>
                {notifications.map((notification) => (
                    <ListItem key={notification.nid} secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => deleteNotification(notification.nid)}>
                            <DeleteIcon />
                        </IconButton>
                    }>
                        <ListItemText
                            primary={notification.message}
                            secondary={new Date(notification.created_at).toLocaleString()}
                        />
                    </ListItem>
                ))}
            </List>

        </Container>
    </React.Fragment>
    );
};

export default NotificationPet;
