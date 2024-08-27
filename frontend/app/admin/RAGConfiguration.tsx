'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/authProvider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function RAGConfiguration() {
  const { axiosInstance } = useAuth();
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [configLoading, setConfigLoading] = useState<boolean>(true);
  const [configError, setConfigError] = useState<string | null>(null);
  const [systemPromptLoading, setSystemPromptLoading] = useState(false);
  const [startersLoading, setStartersLoading] = useState(false);
  const [initialSystemPrompt, setInitialSystemPrompt] = useState<string>('');
  const [initialSuggestedQuestions, setInitialSuggestedQuestions] = useState<
    string[]
  >([]);

  useEffect(() => {
    fetchConfig();
  }, [axiosInstance]);

  const fetchConfig = async () => {
    setConfigLoading(true);
    setConfigError(null);
    try {
      const [configResponse, systemPromptResponse] = await Promise.all([
        axiosInstance.get('/api/chat/config'),
        axiosInstance.get('/api/admin/system-prompt'),
      ]);

      const config = configResponse.data;
      const systemPromptData = systemPromptResponse.data;

      setSystemPrompt(systemPromptData.system_prompt || '');
      setInitialSystemPrompt(systemPromptData.system_prompt || '');
      setSuggestedQuestions(config.starterQuestions || []);
      setInitialSuggestedQuestions(config.starterQuestions || []);
      setConfigLoading(false);
    } catch (err: any) {
      setConfigError(err.message || 'Failed to fetch configuration');
      setConfigLoading(false);
    }
  };

  const updateSystemPrompt = async () => {
    setSystemPromptLoading(true);
    try {
      const response = await axiosInstance.put('/api/admin/system-prompt', {
        new_prompt: systemPrompt,
      });
      if (response.status === 200) {
        console.log('System prompt updated successfully');
        setInitialSystemPrompt(systemPrompt);
      }
    } catch (error) {
      console.error('Failed to update system prompt:', error);
    } finally {
      setSystemPromptLoading(false);
    }
  };

  const updateConversationStarters = async () => {
    setStartersLoading(true);
    try {
      const newStarters = suggestedQuestions.filter((q) => q.trim() !== '');
      const response = await axiosInstance.put(
        '/api/admin/conversation-starters',
        { new_starters: newStarters }
      );
      if (response.status === 200) {
        console.log('Conversation starters updated successfully');
        setInitialSuggestedQuestions(newStarters);
      }
    } catch (error) {
      console.error('Failed to update conversation starters:', error);
    } finally {
      setStartersLoading(false);
    }
  };

  const addSuggestedQuestion = () => {
    setSuggestedQuestions([...suggestedQuestions, '']);
  };

  const updateSuggestedQuestion = (index: number, value: string) => {
    const updatedQuestions = [...suggestedQuestions];
    updatedQuestions[index] = value;
    setSuggestedQuestions(updatedQuestions);
  };

  const deleteSuggestedQuestion = (index: number) => {
    const updatedQuestions = suggestedQuestions.filter((_, i) => i !== index);
    setSuggestedQuestions(updatedQuestions);
  };

  const isSystemPromptChanged = systemPrompt !== initialSystemPrompt;
  const areSuggestedQuestionsChanged =
    JSON.stringify(suggestedQuestions) !==
    JSON.stringify(initialSuggestedQuestions);

  if (configLoading) return <div>Loading configuration...</div>;
  if (configError) return <div>Error: {configError}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>RAG Configuration</CardTitle>
        <CardDescription>
          Configure Retrieval-Augmented Generation settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="systemPrompt">System Prompt</Label>
          <Textarea
            id="systemPrompt"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Enter system prompt here..."
          />
          <Button
            onClick={updateSystemPrompt}
            className="mt-2 w-full"
            variant={isSystemPromptChanged ? 'default' : 'secondary'}
            disabled={systemPromptLoading || !isSystemPromptChanged}
          >
            {systemPromptLoading ? 'Updating...' : 'Update System Prompt'}
          </Button>
        </div>
        <Separator />
        <div>
          <Label>Suggested Questions</Label>
          {suggestedQuestions.map((question, index) => (
            <div key={index} className="flex items-center space-x-2 mt-2">
              <Input
                value={question}
                onChange={(e) => updateSuggestedQuestion(index, e.target.value)}
                placeholder="Enter a suggested question..."
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => deleteSuggestedQuestion(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="w-full flex justify-between items-center mt-2">
            <Button
              variant="outline"
              className="mt-2"
              onClick={addSuggestedQuestion}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Question
            </Button>
            <Button
              variant={areSuggestedQuestionsChanged ? 'default' : 'secondary'}
              onClick={updateConversationStarters}
              className="mt-2 ml-2"
              disabled={startersLoading || !areSuggestedQuestionsChanged}
            >
              {startersLoading ? 'Updating...' : 'Update Conversation Starters'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
