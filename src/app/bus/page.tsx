"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Client, type Frame, type Message } from '@stomp/stompjs';
import Cookies from 'js-cookie';
import { baseUrlStock } from '~/APIs/axios';
import { useUserDataStore } from '~/APIs/store';
import Container from '~/_components/Container';

interface FormData {
  busId: string;
  longitude: string;
  latitude: string;
}

interface BusLocation {
  busId: number;
  longitude: number;
  latitude: number;
}

interface NotificationData {
  id: number;
  title: string;
  description: string;
}

interface RawBusData {
  data: {
    id: number;
    longitude: number;
    latitude: number;
  };
}

interface Subscription {
  unsubscribe: () => void;
}

const Bus: React.FC = () => {
  const [connected, setConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<BusLocation[]>([]);
  const [formData, setFormData] = useState<FormData>({
    busId: '',
    longitude: '',
    latitude: ''
  });
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  
  const token = Cookies.get('token');
  const userData = useUserDataStore.getState().userData;
  const userId = userData.id;

  const subscribeToBusLocation = useCallback((client: Client, busId: string) => {
    // Unsubscribe from previous subscription if exists
    if (currentSubscription) {
      currentSubscription.unsubscribe();
    }

    // Create new subscription
    const subscription = client.subscribe(`/topic/bus-location/${busId}`, (message: Message) => {
      const rawData: RawBusData = JSON.parse(message.body);
      const data: BusLocation = {
        busId: rawData.data.id,
        longitude: rawData.data.longitude,
        latitude: rawData.data.latitude
      };
      addMessage(data);
    });

    setCurrentSubscription(subscription);
  }, []);

  useEffect(() => {
    const client = new Client({
      brokerURL: `${baseUrlStock}ws?token=${token}`,
      debug: (str: string) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame: Frame) => {
      setConnected(true);
      console.log('Connected: ' + JSON.stringify(frame));

      try {
        // Subscribe to notifications
        client.subscribe(`/user/${userId}/notifications`, (message: Message) => {
          const rawData: NotificationData = JSON.parse(message.body);
          showNotification(rawData);
        });

        // Initially subscribe to bus location if busId is available
        if (formData.busId) {
          subscribeToBusLocation(client, formData.busId);
        }
      } catch (error) {
        console.error("Error during subscription:", error);
      }
    };

    client.onWebSocketError = (error: Event) => {
      console.error('WebSocket error:', error);
    };

    client.onStompError = (frame: Frame) => {
      console.error('Broker reported error: ' + frame.headers.message);
      console.error('Additional details: ' + frame.body);
    };

    setStompClient(client);

    return () => {
      if (currentSubscription) {
        currentSubscription.unsubscribe();
      }
      if (client) {
        client.deactivate();
      }
    };
  }, [userId, token, subscribeToBusLocation]);

  // Handle bus ID changes
  useEffect(() => {
    if (connected && stompClient && formData.busId) {
      subscribeToBusLocation(stompClient, formData.busId);
    }
  }, [connected, stompClient, formData.busId, subscribeToBusLocation]);

  const connect = useCallback(() => {
    if (stompClient) {
      stompClient.activate();
    }
  }, [stompClient]);

  const disconnect = useCallback(() => {
    if (stompClient) {
      if (currentSubscription) {
        currentSubscription.unsubscribe();
        setCurrentSubscription(null);
      }
      stompClient.deactivate();
      setConnected(false);
      setMessages([]);
    }
  }, [stompClient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const sendData = useCallback(() => {
    if (!formData.busId || !formData.longitude || !formData.latitude) {
      alert("Please fill all fields!");
      return;
    }

    const data: BusLocation = {
      busId: parseInt(formData.busId),
      longitude: parseFloat(formData.longitude),
      latitude: parseFloat(formData.latitude),
    };

    try {
      if (!stompClient) {
        throw new Error('STOMP client is not initialized');
      }

      stompClient.publish({
        destination: "/app/update-location",
        body: JSON.stringify(data),
      });
      console.log("Data sent successfully:", data);
      // Don't reset busId after sending to maintain subscription
      setFormData(prev => ({
        ...prev,
        longitude: '',
        latitude: ''
      }));
    } catch (error) {
      console.error("Error during data sending:", error);
    }
  }, [stompClient, formData]);

  const addMessage = (data: BusLocation) => {
    setMessages(prev => [...prev, data]);
  };

  const showNotification = (data: NotificationData) => {
    if (Notification.permission === "granted") {
      new Notification("Bus Location Update", {
        body: `Bus ID: ${data.id} - ${data.title}: ${data.description}`,
        icon: "https://via.placeholder.com/48"
      });
    }
  };

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then(permission => {
        console.log("Notification permission: ", permission);
      });
    }
  }, []);

  return (
    <Container>
      <div className="p-4">
        <h1 className="text-2xl mb-4">WebSocket Local Test</h1>
        
        <div className="mb-4">
          <button
            className={`mr-2 px-4 py-2 rounded ${connected ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
            onClick={connect}
            disabled={connected}
          >
            Connect
          </button>
          <button
            className={`px-4 py-2 rounded ${!connected ? 'bg-gray-300' : 'bg-red-500 text-white'}`}
            onClick={disconnect}
            disabled={!connected}
          >
            Disconnect
          </button>
        </div>

        {connected && (
          <div className="mb-4">
            <h2 className="text-xl mb-2">Messages</h2>
            <div className="border rounded p-2">
              {messages.map((msg, index) => (
                <div key={index} className="mb-1">
                  ID: {msg.busId}, Longitude: {msg.longitude}, Latitude: {msg.latitude}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            id="busId"
            className="border rounded px-2 py-1"
            placeholder="Enter ID"
            value={formData.busId}
            onChange={handleInputChange}
          />
          <input
            type="text"
            id="longitude"
            className="border rounded px-2 py-1"
            placeholder="Enter Longitude"
            value={formData.longitude}
            onChange={handleInputChange}
          />
          <input
            type="text"
            id="latitude"
            className="border rounded px-2 py-1"
            placeholder="Enter Latitude"
            value={formData.latitude}
            onChange={handleInputChange}
          />
          <button
            className="bg-green-500 text-white px-4 py-1 rounded"
            onClick={sendData}
          >
            Send
          </button>
        </div>
      </div>
    </Container>
  );
};

export default Bus;