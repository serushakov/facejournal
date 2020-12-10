const handleGetConfig = (req, res) => {
  res.send({
    defaults: {
      background: '/static/images/user-cover-image-placeholder.jpg',
      avatar: '/static/images/user-avatar-placeholder.jpg',
    },
  });
};

export default handleGetConfig;
