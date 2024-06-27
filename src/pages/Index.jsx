import React, { useEffect, useState } from "react";
import { Container, Text, VStack, Input, Box, Link, useColorMode, Button } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "react-icons/fa";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    fetchTopStories();
  }, []);

  useEffect(() => {
    filterStories();
  }, [searchTerm, stories]);

  const fetchTopStories = async () => {
    try {
      const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
      const storyIds = await response.json();
      const top5StoryIds = storyIds.slice(0, 5);
      const storyPromises = top5StoryIds.map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
      );
      const stories = await Promise.all(storyPromises);
      setStories(stories);
      setFilteredStories(stories);
    } catch (error) {
      console.error("Error fetching top stories:", error);
    }
  };

  const filterStories = () => {
    const filtered = stories.filter(story =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStories(filtered);
  };

  return (
    <Container centerContent maxW="container.md" py={8}>
      <VStack spacing={4} width="100%">
        <Button onClick={toggleColorMode} alignSelf="flex-end">
          {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        </Button>
        <Text fontSize="2xl" fontWeight="bold">Top 5 Hacker News Stories</Text>
        <Input
          placeholder="Search stories..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {filteredStories.map(story => (
          <Box key={story.id} p={4} borderWidth="1px" borderRadius="md" width="100%">
            <Text fontSize="lg" fontWeight="bold">{story.title}</Text>
            <Link href={story.url} color="teal.500" isExternal>Read more</Link>
            <Text>Upvotes: {story.score}</Text>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;