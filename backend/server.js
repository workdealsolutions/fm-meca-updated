const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Enable CORS for all origins in development
app.use(cors());
app.use(express.json());

app.post('/api/messages', async (req, res) => {
    try {
        const messageData = req.body;
        
        if (!messageData || Object.keys(messageData).length === 0) {
            return res.status(400).json({ 
                success: false,
                error: 'Message data is required' 
            });
        }

        // Log the received data
        console.log('Received message:', messageData);
        
        // Send success response
        return res.status(201).json({ 
            success: true,
            message: 'Message received successfully' 
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Internal server error',
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api/messages`);
});
