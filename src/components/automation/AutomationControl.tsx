import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Square, MessageSquare, Activity } from 'lucide-react';
import { RootState, AppDispatch } from '@/store';
import { startAutomation, stopAutomation, sendMessage } from '@/store/slices/automationSlice';
import { useState } from 'react';

export const AutomationControl = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isActive, status, recentMessages, isLoading, error } = useSelector(
    (state: RootState) => state.automation
  );
  
  const [targetUrl, setTargetUrl] = useState('https://chat.openai.com');
  const [messageToSend, setMessageToSend] = useState('');

  const handleStart = async () => {
    try {
      await dispatch(startAutomation(targetUrl)).unwrap();
    } catch (error) {
      console.error('Failed to start automation:', error);
    }
  };

  const handleStop = async () => {
    try {
      await dispatch(stopAutomation()).unwrap();
    } catch (error) {
      console.error('Failed to stop automation:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageToSend.trim()) return;
    
    try {
      await dispatch(sendMessage({ 
        message: messageToSend,
        options: { humanLike: true, typing: true }
      })).unwrap();
      setMessageToSend('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Browser Automation Control
          </CardTitle>
          <CardDescription>
            Control the automated browser listener for chat platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant={isActive ? 'default' : 'secondary'}>
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="targetUrl">Target URL</Label>
            <Input
              id="targetUrl"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://chat.openai.com"
              disabled={isActive}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex space-x-2">
            <Button
              onClick={handleStart}
              disabled={isActive || isLoading}
              className="flex-1"
            >
              <Play className="mr-2 h-4 w-4" />
              {isLoading ? 'Starting...' : 'Start Automation'}
            </Button>
            <Button
              onClick={handleStop}
              disabled={!isActive || isLoading}
              variant="destructive"
              className="flex-1"
            >
              <Square className="mr-2 h-4 w-4" />
              Stop Automation
            </Button>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Send Message */}
      {isActive && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Send Message
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={messageToSend}
                onChange={(e) => setMessageToSend(e.target.value)}
                placeholder="Type a message to send..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} disabled={!messageToSend.trim()}>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Info */}
      {isActive && (
        <Card>
          <CardHeader>
            <CardTitle>Automation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Initialized:</span> 
                {status.isInitialized ? ' ✅ Yes' : ' ❌ No'}
              </div>
              <div>
                <span className="font-medium">Listening:</span> 
                {status.isListening ? ' 👂 Yes' : ' 🔇 No'}
              </div>
              <div>
                <span className="font-medium">Messages Seen:</span> {status.messagesSeen}
              </div>
              <div>
                <span className="font-medium">Last Activity:</span> 
                {status.lastActivity 
                  ? new Date(status.lastActivity).toLocaleTimeString()
                  : ' None'
                }
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Messages */}
      {recentMessages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {recentMessages.map((message, index) => (
                <div key={index} className="text-sm p-2 bg-muted/50 rounded">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{message.sender}</span>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="mt-1">{message.content}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};