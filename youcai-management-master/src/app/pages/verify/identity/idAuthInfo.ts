import { Guid } from 'guid-typescript';

export interface IdAuthInfo {
  userId: Guid;
  idFront: string;
  idBack: string;
  idCard: string;
  remark: string;
  idAuthState: number;
  createTime: Date;
  updateTime: Date;
}

//   public class IdAuthInfo
//     {
//         [Key]
//         public Guid UserId { get; set; }
//         /// <summary>
//         /// 正面
//         /// </summary>
//         [MaxLength(256)]
//         public string IdFront { get; set; }
//         /// <summary>
//         /// 反面
//         /// </summary>
//         [MaxLength(256)]
//         public string IdBack { get; set; }
//         /// <summary>
//         /// /*身份证号*/"5111261995****1111",
//         /// </summary>
//         [StringLength(18)]
//         public string IdCard { get; set; }
//         /// <summary>
//         /// 备注
//         /// </summary>
//         public string Remark { get; set; }
//         /// <summary>
//         /// 认证状态：0 提交；1 审核通过；2 审核不通过
//         /// </summary>
//         public byte IdAuthState { get; set; }
//         public DateTime CreateTime { get; set; }
//         public DateTime UpdateTime { get; set; }
//     }
