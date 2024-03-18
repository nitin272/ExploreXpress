route.get('/', (req, res) => {
    Website.find({})
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        res.status(500).send('Error fetching data');
      });
  });