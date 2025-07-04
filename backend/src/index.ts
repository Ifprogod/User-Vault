import express from 'express';

const app = express();
const port = process.env.PORT || 5000; // Cổng mặc định là 5000

app.use(express.json()); // Để xử lý body request dạng JSON

app.get('/', (req, res) => {
  res.send('Backend UserVault đang chạy ngon lành!');
});

app.listen(port, () => {
  console.log(`Server UserVault backend đang lắng nghe tại http://localhost:${port}`);
});
