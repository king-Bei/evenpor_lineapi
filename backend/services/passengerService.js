const supabase = require('./supabase');

/**
 * 旅客報到：根據身分證字號 (id_number) 更新或新增資料
 * 這就是將 LINE UID 與 Excel 匯入資料 JOIN 的關鍵邏輯
 */
/**
 * 旅客報到：根據身分證字號 (id_number) 與 生日 (birthday) 進行核對
 */
const upsertPassengerCheckIn = async (idNumber, birthday, lineData) => {
  // 1. 根據身分證與生日進行精準查詢
  const { data: passenger, error: fetchError } = await supabase
    .from('passengers')
    .select('*')
    .eq('id_number', idNumber)
    .eq('birthday', birthday)
    .single();

  if (fetchError) {
    if (fetchError.code === 'PGRST116') {
      throw new Error('找不到報到資料，請確認身分證與生日是否輸入正確。');
    }
    throw fetchError;
  }

  // 2. 安全性檢查：是否已被其他 LINE 帳號綁定
  if (passenger.line_uid && passenger.line_uid !== lineData.userId) {
    throw new Error('該資料已被其他 LINE 帳號綁定，如有疑問請洽工作人員。');
  }

  // 3. 狀態檢查：是否已報到過
  if (passenger.status === 'checked_in') {
    return { ...passenger, alreadyCheckedIn: true };
  }

  // 4. 執行報到更新
  const { data: updatedData, error: updateError } = await supabase
    .from('passengers')
    .update({
      line_uid: lineData.userId,
      line_display_name: lineData.displayName,
      status: 'checked_in',
      check_in_time: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', passenger.id)
    .select();

  if (updateError) throw updateError;
  return updatedData[0];
};

/**
 * 管理員匯入 Excel 資料
 */
const importPassengersFromExcel = async (passengerList) => {
  const { data, error } = await supabase
    .from('passengers')
    .upsert(passengerList, {
      onConflict: 'id_number'
    });

  if (error) throw error;
  return data;
};

module.exports = {
  upsertPassengerCheckIn,
  importPassengersFromExcel
};
