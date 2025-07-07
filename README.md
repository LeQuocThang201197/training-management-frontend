# Vite React Shadcn Demo

Vite React Shadcn Demo is a React-based application built with Vite, TypeScript, ShadCN UI, and Tailwind CSS.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (version 14 or higher)
- npm (usually comes with Node.js)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/VoloBuilds/vite-react-shadcn-demo.git
   cd vite-react-shadcn-demo
   ```

2. Install the dependencies:
   ```
   npm install
   ```

## Running the Application

To start the development server:

```
npm run dev
```

This will start the Vite development server. Open your browser and navigate to `http://localhost:5173` to view the application.

## Building for Production

To build the application for production:

```
npm run build
```

This will create a `dist` folder with the production-ready files.

## Additional Scripts

- `npm run lint`: Run ESLint to check for code quality and style issues.
- `npm run preview`: Preview the production build locally.

## Project Structure

The main application code is located in the `src` directory:

- `src/App.tsx`: The main application component
- `src/components/`: Reusable React components
- `src/lib/`: Utility functions and helpers
- `src/index.css`: Global styles and Tailwind CSS imports

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components

## Configuration Files

- `tsconfig.json`: TypeScript configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `vite.config.ts`: Vite configuration
- `eslint.config.js`: ESLint configuration

For more details on the project setup and configuration, refer to the respective configuration files in the project root.

If starting a project from scratch, see this guide on how to use shadcn/ui with vite here: https://ui.shadcn.com/docs/installation/vite

Also see the Cursor tutorial relating to this project here:
https://youtu.be/PlQPSkIUdIk

# Training Management System

## Tính năng chính

### 🎯 Quản lý đợt tập trung

- Tạo và quản lý các đợt tập trung thể thao
- Theo dõi thông tin đội tuyển, thời gian, địa điểm
- Quản lý giấy tờ liên quan

### 👥 Quản lý thành viên (AddParticipantMultiDialog)

Hệ thống cung cấp 3 cách thêm thành viên vào đợt tập trung:

#### 1. **Từ đợt tập trung khác**

- Tìm kiếm và lọc các đợt tập trung đã có
- Chọn thành viên từ đợt tập trung khác để copy
- Tự động copy vai trò và đơn vị từ đợt gốc

#### 2. **Từ danh sách có sẵn**

- Tìm kiếm nhân sự đã có trong hệ thống
- Chọn người và thiết lập vai trò, đơn vị mới
- Kiểm tra trùng lặp tự động

#### 3. **Thêm nhân sự mới**

- Tạo nhân sự hoàn toàn mới
- Nhập đầy đủ thông tin cá nhân
- Tự động thêm vào đợt tập trung hiện tại

### 🏃‍♂️ Quản lý tập huấn và thi đấu

- Tạo các đợt tập huấn trong nước/nước ngoài
- Quản lý các đợt thi đấu
- Theo dõi người tham gia từng sự kiện

### 📋 Quản lý vắng mặt

- Theo dõi tình trạng vắng mặt của thành viên
- Phân loại: nghỉ phép, không tham gia đợt tập trung

### 📄 Quản lý giấy tờ

- Liên kết giấy tờ với đợt tập trung
- Xem và tải file đính kèm
- Tìm kiếm và phân trang

## Công nghệ sử dụng

- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **State Management**: React Hooks
- **API**: REST API với fetch
- **Routing**: React Router
- **Icons**: Lucide React

## Cài đặt và chạy

```bash
# Clone repository
git clone [repository-url]

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build
```

## Cấu trúc thư mục

```
src/
├── components/
│   ├── dialogs/
│   │   ├── AddParticipantMultiDialog.tsx  # Dialog thêm thành viên 3-tab
│   │   ├── ConcentrationDialog.tsx
│   │   └── ...
│   ├── cards/
│   └── ui/
├── pages/
│   ├── ConcentrationDetail.tsx            # Trang chi tiết đợt tập trung
│   └── ...
├── types/
│   ├── participant.ts
│   ├── concentration.ts
│   └── ...
└── config/
    └── api.ts
```

## API Endpoints

### Participants

- `POST /concentrations/{id}/participants` - Thêm thành viên mới
- `POST /concentrations/{id}/participants/copy` - Copy thành viên từ đợt khác
- `GET /concentrations/{id}/participants` - Lấy danh sách thành viên
- `PUT /concentrations/{id}/participants/{participantId}` - Cập nhật thành viên
- `DELETE /concentrations/{id}/participants/{participantId}` - Xóa thành viên

### Search

- `GET /persons?q={searchTerm}` - Tìm kiếm nhân sự
- `GET /concentrations` - Lấy danh sách đợt tập trung với filter & pagination
  - **Filters:** `sportId`, `teamType`, `status`, `year` (support multiple values với comma)
  - **Sort:** `sortBy` (startDate|teamName), `sortOrder` (asc|desc)
  - **Pagination:** `page`, `limit`
  - **Example:** `/concentrations?sportId=1,2&teamType=ADULT,JUNIOR&status=active&sortBy=startDate&sortOrder=desc&page=1&limit=20`

### Master Data

- `GET /person-roles` - Lấy danh sách vai trò
- `GET /organizations/all` - Lấy danh sách đơn vị

## Tính năng nổi bật

### 🔍 Tìm kiếm thông minh

- Debounced search cho performance tốt
- Filter theo nhiều tiêu chí
- Pagination cho danh sách lớn

### 🛡️ Type Safety

- Full TypeScript support
- Type guards cho API responses
- Proper error handling

### 🎨 UI/UX

- Responsive design
- Loading states
- Error feedback
- Confirmation dialogs

### 🚀 Performance

- Parallel API calls
- Optimized re-renders
- Efficient state management

## Đóng góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## License

[License information]
