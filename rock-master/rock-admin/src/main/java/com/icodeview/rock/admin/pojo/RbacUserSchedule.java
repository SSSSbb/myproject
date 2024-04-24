package com.icodeview.rock.admin.pojo;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;

@TableName(value ="rbac_user_schedule")
@Data
@NoArgsConstructor
public class RbacUserSchedule implements Serializable {
    /**
     *
     */
    @TableId(value = "id")
    private Long id;



    public RbacUserSchedule(Long userId, Integer slot, Integer weekday,Integer belongto,LocalDateTime createTime) {
        this.userid = userId;
        this.slot = slot;
        this.weekday = weekday;
        this.belongto = belongto;
        this.createTime = createTime;
    }

    /**
     *
     */
    @TableField(value = "userid")
    private Long userid;

    /**
     * 一天中第几个
     */
    @TableField(value = "slot")
    private Integer slot;

    /**
     * 周几
     */
    @TableField(value = "weekday")
    private Integer weekday;

    @TableField(value = "belongto")
    private Integer belongto;


    private LocalDateTime createTime;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
