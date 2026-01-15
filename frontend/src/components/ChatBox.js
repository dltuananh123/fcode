import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import {
  Box,
  Paper,
  Fab,
  IconButton,
  TextField,
  Typography,
  Avatar,
  Divider,
  Slide,
  Fade,
  useTheme,
  useMediaQuery,
  Badge,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Forum as ForumIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const socket = io.connect("http://localhost:8080");

const StyledChatContainer = styled(Paper)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  width: "380px",
  maxWidth: "calc(100vw - 32px)",
  height: "500px",
  maxHeight: "calc(100vh - 100px)",
  display: "flex",
  flexDirection: "column",
  zIndex: 1400, // Higher than MUI AppBar (1100) and Drawer (1200)
  boxShadow: theme.shadows[8],
  borderRadius: theme.shape.borderRadius * 2,
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    maxWidth: "100%",
    height: "100%",
    maxHeight: "100%",
    bottom: 0,
    right: 0,
    borderRadius: 0,
  },
}));

const StyledChatHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
}));

const StyledMessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: theme.palette.grey[100],
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.grey[400],
    borderRadius: "8px",
    "&:hover": {
      background: theme.palette.grey[500],
    },
  },
}));

const StyledMessageBubble = styled(Box)(({ theme, isOwn }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: isOwn ? "flex-end" : "flex-start",
  marginBottom: theme.spacing(2),
  "&:last-child": {
    marginBottom: 0,
  },
}));

const MessageBubble = styled(Paper)(({ theme, isOwn }) => ({
  display: "inline-block",
  maxWidth: "75%",
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: isOwn
    ? theme.palette.primary.main
    : theme.palette.background.paper,
  color: isOwn
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary,
  boxShadow: theme.shadows[2],
  wordWrap: "break-word",
  wordBreak: "break-word",
}));

const StyledInputContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1.5, 2),
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(1),
}));

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const userObj = JSON.parse(localStorage.getItem("user"));
  const user = userObj?.user;
  const username = user ? user.full_name : "Guest";
  const userId = user ? user.id : null;
  const userInitials = username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/chat");

        const history = res.data.map((msg) => {
          let timeString = "";
          try {
            timeString = msg.created_at
              ? new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
          } catch (e) {
            timeString = "";
          }

          return {
            author: msg.sender ? msg.sender.full_name : "Anonymous",
            message: msg.content,
            time: timeString,
            isOwn: msg.sender && msg.sender.id === userId,
          };
        });
        setMessageList(history);
      } catch (err) {
        console.log("Error loading chat:", err);
      }
    };

    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, userId]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [
        ...list,
        { ...data, isOwn: data.author === username },
      ]);
    });
    return () => socket.off("receive_message");
  }, [username]);

  const sendMessage = async () => {
    if (currentMessage.trim() !== "" && userId) {
      const messageData = {
        user_id: userId,
        author: username,
        message: currentMessage.trim(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: true,
      };

      await socket.emit("send_message", messageData);
      setCurrentMessage("");
    } else if (!userId) {
      alert("You need to login to chat!");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <Fade in={!isOpen}>
          <Fab
            color="primary"
            aria-label="open chat"
            onClick={() => setIsOpen(true)}
            sx={{
              position: "fixed",
              bottom: theme.spacing(2),
              right: theme.spacing(2),
              zIndex: 1000,
              boxShadow: theme.shadows[8],
            }}
          >
            <Badge
              badgeContent={messageList.length > 0 ? messageList.length : 0}
              color="error"
              max={99}
            >
              <ChatIcon />
            </Badge>
          </Fab>
        </Fade>
      )}

      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <StyledChatContainer elevation={8}>
          <StyledChatHeader>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.contrastText,
                  color: theme.palette.primary.main,
                  width: 32,
                  height: 32,
                }}
              >
                <ForumIcon fontSize="small" />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Community Chat
              </Typography>
            </Box>
            <IconButton
              onClick={() => setIsOpen(false)}
              sx={{ color: theme.palette.primary.contrastText }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </StyledChatHeader>

          <Divider />

          <StyledMessagesContainer>
            {messageList.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: theme.palette.text.secondary,
                }}
              >
                <ForumIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  No messages yet. Start the conversation!
                </Typography>
              </Box>
            ) : (
              messageList.map((msg, index) => {
                const isOwn = msg.author === username;
                return (
                  <StyledMessageBubble key={index} isOwn={isOwn}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                        flexDirection: isOwn ? "row-reverse" : "row",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          fontSize: "0.75rem",
                          bgcolor: isOwn
                            ? theme.palette.primary.main
                            : theme.palette.secondary.main,
                        }}
                      >
                        {msg.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </Avatar>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {msg.author}
                      </Typography>
                    </Box>
                    <MessageBubble isOwn={isOwn} elevation={2}>
                      <Typography variant="body2">{msg.message}</Typography>
                    </MessageBubble>
                    <Typography
                      variant="caption"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: "0.7rem",
                        mt: 0.5,
                      }}
                    >
                      {msg.time}
                    </Typography>
                  </StyledMessageBubble>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </StyledMessagesContainer>

          <Divider />

          <StyledInputContainer>
            <TextField
              fullWidth
              placeholder={
                userId
                  ? "Type a message..."
                  : "Please login to send messages"
              }
              value={currentMessage}
              onChange={(event) => setCurrentMessage(event.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!userId}
              size="small"
              variant="outlined"
              multiline
              maxRows={3}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 8,
                  backgroundColor: theme.palette.background.paper,
                },
              }}
            />
            <IconButton
              color="primary"
              onClick={sendMessage}
              disabled={!userId || currentMessage.trim() === ""}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  bgcolor: theme.palette.primary.dark,
                },
                "&.Mui-disabled": {
                  bgcolor: theme.palette.action.disabledBackground,
                  color: theme.palette.action.disabled,
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </StyledInputContainer>
        </StyledChatContainer>
      </Slide>
    </>
  );
};

export default ChatBox;
