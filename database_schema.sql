-- 旅客資料表 (Passengers)
CREATE TABLE passengers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  id_number TEXT UNIQUE NOT NULL, -- 作為 Unique Key 進行 Join 核對
  birthday DATE, -- 出生年月日 (YYYY-MM-DD)
  phone TEXT,
  line_uid TEXT UNIQUE, -- LINE 用戶唯一識別碼
  line_display_name TEXT,
  status TEXT DEFAULT 'pending', -- pending, checked_in
  check_in_time TIMESTAMPTZ,
  metadata JSONB, -- 存儲動態自訂欄位
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 管理員資料表 (Admins)
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_passengers_id_number ON passengers(id_number);
CREATE INDEX idx_passengers_line_uid ON passengers(line_uid);
