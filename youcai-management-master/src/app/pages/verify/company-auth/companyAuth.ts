import { Guid } from 'guid-typescript';

export interface CompanyAuth {
  userId: Guid;
  text: string;
  images: string;
  remark: string;
  authState: number;
  createTime: Date;
  updateTime: Date;
}

//   public Guid UserId { get; set; }
//   /// <summary>
//   /// 认证说明
//   /// </summary>
//   public string Text { get; set; }
//   /// <summary>
//   /// 认证图片
//   /// </summary>
//   public string Images { get; set; }
//   public DateTime CreateTime { get; set; }
//   public DateTime UpdateTime { get; set; }
//   /// <summary>
//   /// 认证状态：0 提交；1 审核通过；2 审核不通过
//   /// </summary>
//   public byte AuthState { get; set; }
//   /// <summary>
//   /// 说明
//   /// </summary>
//   public string Remark { get; set; }
