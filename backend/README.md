# API Đăng Ký và Đăng Nhập

API đơn giản cho việc đăng ký và đăng nhập người dùng.

## Cài đặt

```bash
# Cài đặt các dependencies
npm install

# Chạy server ở chế độ development
npm run dev

# Chạy server ở chế độ production
npm start
```

## API Endpoints

### Đăng Ký

```
POST /api/auth/register
```

Body:

```json
{
  "name": "Nguyễn Văn A",
  "email": "thanhanmuop@gmal.com",
  "phone": "0123456789",
  "password": "$2a$12$xqGlqhGjrollHGrt9RmYIOBvPuY8e3oigJHG1GsiHRXrMOAuMxrlG",
  "role": "customer" // Tùy chọn, mặc định là "customer"
}
```

Response:

```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "user": {
      "id": 1,
      "name": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "phone": "0123456789",
      "role": "customer",
      "created_at": "2023-03-13T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

### Đăng Nhập

```
POST /api/auth/login
```

Body:

```json
{
  "email": "nguyenvana@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": {
      "id": 1,
      "name": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "phone": "0123456789",
      "role": "customer",
      "created_at": "2023-03-13T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

### Lấy Thông Tin Người Dùng Hiện Tại

```
GET /api/auth/me
```

Headers:

```
Authorization: Bearer jwt_token_here
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "phone": "0123456789",
      "role": "customer",
      "created_at": "2023-03-13T00:00:00.000Z"
    }
  }
}
```

## Lưu ý

- Token JWT có thời hạn 24 giờ
- Mật khẩu được mã hóa bằng bcrypt trước khi lưu vào cơ sở dữ liệu
- API không yêu cầu xác thực email hoặc số điện thoại 