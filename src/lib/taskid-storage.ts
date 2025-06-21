import fs from 'fs/promises';
import path from 'path';

interface TaskRecord {
  taskId: string;
  userId: string;
  userEmail: string;
  videoId: string;
  prompt: string;
  createdAt: string;
  status?: string;
  videoUrl?: string;
  videoUrl1080p?: string;
}

const STORAGE_FILE = path.join(process.cwd(), 'task-storage.json');

// 保存TaskID记录
export async function saveTaskRecord(record: TaskRecord): Promise<void> {
  try {
    let records: TaskRecord[] = [];
    
    // 尝试读取现有记录
    try {
      const data = await fs.readFile(STORAGE_FILE, 'utf-8');
      records = JSON.parse(data);
    } catch (error) {
      // 文件不存在或为空，使用空数组
      records = [];
    }
    
    // 添加新记录
    records.push(record);
    
    // 保持最近100条记录
    if (records.length > 100) {
      records = records.slice(-100);
    }
    
    // 写入文件
    await fs.writeFile(STORAGE_FILE, JSON.stringify(records, null, 2));
    console.log('✅ TaskID记录已保存:', record.taskId);
  } catch (error) {
    console.error('❌ 保存TaskID记录失败:', error);
  }
}

// 根据TaskID查找记录
export async function findTaskRecord(taskId: string): Promise<TaskRecord | null> {
  try {
    const data = await fs.readFile(STORAGE_FILE, 'utf-8');
    const records: TaskRecord[] = JSON.parse(data);
    return records.find(record => record.taskId === taskId) || null;
  } catch (error) {
    console.error('❌ 查找TaskID记录失败:', error);
    return null;
  }
}

// 根据用户ID获取所有记录
export async function getUserTaskRecords(userId: string): Promise<TaskRecord[]> {
  try {
    const data = await fs.readFile(STORAGE_FILE, 'utf-8');
    const records: TaskRecord[] = JSON.parse(data);
    return records.filter(record => record.userId === userId);
  } catch (error) {
    console.error('❌ 获取用户TaskID记录失败:', error);
    return [];
  }
}

// 更新TaskID记录状态
export async function updateTaskRecord(taskId: string, updates: Partial<TaskRecord>): Promise<void> {
  try {
    const data = await fs.readFile(STORAGE_FILE, 'utf-8');
    const records: TaskRecord[] = JSON.parse(data);
    
    const index = records.findIndex(record => record.taskId === taskId);
    if (index !== -1) {
      records[index] = { ...records[index], ...updates };
      await fs.writeFile(STORAGE_FILE, JSON.stringify(records, null, 2));
      console.log('✅ TaskID记录已更新:', taskId);
    }
  } catch (error) {
    console.error('❌ 更新TaskID记录失败:', error);
  }
} 