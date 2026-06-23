# Tài Liệu Đặc Tả Use Case (Dựa theo hình ảnh gốc)
**Tên phân hệ:** Trò chơi Suy luận Logic (Logic Deduction - Order Logic)

---

## 1. Danh sách Tác nhân (Actors)

| Tác nhân | Mô tả |
| :--- | :--- |
| **Người học (Learner)** | Người dùng hệ thống, trực tiếp đọc dữ kiện và thao tác giải các bài toán sắp xếp logic. |
| **Hệ thống (System)** | Trình bày câu hỏi, xử lý thao tác kéo thả, chấm điểm và đưa ra giải thích (hints/explanations). |

---

## 2. Danh sách Use Case (Dựa trên UI/UX thực tế từ ảnh)

Dưới đây là các Use Case được phân tích trực tiếp từ các màn hình bạn đã cung cấp:

1. **UC01: Chọn bài học từ Lộ trình (Select Lesson from Roadmap)** *(Tham chiếu ảnh Menu)*
2. **UC02: Giải bài tập Sắp xếp (Solve Ordering Puzzle)** *(Tham chiếu ảnh câu hỏi)*
3. **UC03: Kiểm tra Đáp án (Check Answer)** *(Tham chiếu nút Check và kết quả)*
4. **UC04: Xem giải thích Logic (View Explanation)** *(Tham chiếu nút "Why?" và dòng giải thích)*
5. **UC05: Theo dõi Tiến độ (Track Progress & Streak)** *(Tham chiếu thanh progress bar và tia sét góc phải)*

---

## 3. Đặc tả Use Case chi tiết

### UC01: Chọn bài học từ Lộ trình (Select Lesson from Roadmap)
* **Actor:** Người học
* **Mô tả:** Người học tương tác với màn hình Course Menu để bắt đầu học.
* **Luồng sự kiện:**
  1. Người học vào màn hình danh sách bài học (Level 1: Order Logic).
  2. Hệ thống hiển thị các node bài học: *Neighbors*, *Heights*, *Comparisons*, *Level Review*.
  3. Người học bấm vào nút **"Start"** màu xanh dương ở bài học *Neighbors*.
  4. Hệ thống hiển thị màn hình Intro: "Neighbors - The robots line up for evaluation" và có nút Continue.

---

### UC02: Giải bài tập Sắp xếp (Solve Ordering Puzzle)
* **Actor:** Người học
* **Mô tả:** Thao tác cốt lõi của môn học, người dùng phải sắp xếp Robot dựa trên các dữ kiện (Clues).
* **Luồng sự kiện:**
  1. Hệ thống hiển thị yêu cầu bài toán (VD: "Line up the robots in the proper order").
  2. Hệ thống cung cấp danh sách dữ kiện Logic (VD: *B and C are both neighbors of D*, *A and B are both before C*).
  3. Người học tiến hành **Kéo và Thả (Drag & Drop)** các thẻ hình Robot (A, B, C, D) từ kho (Pool) vào các ô trống được đánh số (1, 2, 3, 4).
  4. Hệ thống cập nhật hiển thị Robot nằm ngay ngắn trong các ô trống.

---

### UC03: Kiểm tra Đáp án (Check Answer)
* **Actor:** Người học, Hệ thống
* **Mô tả:** Hệ thống đánh giá thứ tự xếp Robot của người học.
* **Luồng sự kiện:**
  1. Sau khi điền kín các ô, người học bấm nút **"Check"** (nút màu trắng).
  2. Hệ thống đối chiếu thứ tự Robot hiện tại với Đáp án Logic chuẩn.
  3. **Nếu Đúng:**
     - Hệ thống hiển thị thông báo "Correct order ✔" kèm khung nền tối.
     - Các dữ kiện Logic phía trên chuyển thành dấu Check xanh lá (✔).
     - Nút "Check" biến thành nút **"Continue"** màu xanh lá.
     - Xuất hiện thông báo phụ "That's it!" bên góc trái.
  4. **Nếu Sai:**
     - Hệ thống báo lỗi, rung nút Check, yêu cầu người học đổi lại vị trí các Robot.

---

### UC04: Xem giải thích Logic (View Explanation)
* **Actor:** Người học
* **Mô tả:** Hệ thống hỗ trợ người học hiểu lý do tại sao lại xếp như vậy.
* **Luồng sự kiện:**
  1. Tại màn hình "Correct order", kế bên nút Continue sẽ hiện ra nút **"Why?"** (tùy thuộc vào độ khó câu hỏi).
  2. Người học bấm vào nút **"Why?"**.
  3. Hệ thống hiển thị một đoạn văn bản tóm tắt lại quá trình suy luận.
     *(VD theo ảnh: "Multiple clues about the same robot can eliminate possibilities. Since B finished before C and after D, they can't be in first or last.")*
  4. Người học bấm Continue để sang câu tiếp theo.

---

### UC05: Theo dõi Tiến độ (Track Progress & Streak)
* **Actor:** Hệ thống
* **Mô tả:** Việc cộng điểm kinh nghiệm và hiển thị thanh tiến độ nằm ngang.
* **Luồng sự kiện:**
  1. Mỗi khi người học hoàn thành đúng một câu hỏi (bấm Continue).
  2. Hệ thống tăng chiều dài của **thanh Progress Bar** màu xanh lá cây nằm ở mép trên cùng màn hình.
  3. Hệ thống cộng thêm điểm số (VD: từ 15 ⚡ lên 30 ⚡, 45 ⚡, 60 ⚡) hiển thị góc trên cùng bên phải.
  4. Khi Progress bar đầy, màn hình báo hoàn thành bài học (Lesson Completed).
