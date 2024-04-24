package com.icodeview.rock.admin.pojo;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;


@TableName(value ="rbac_user_preferences")
@Data
public class RbacUserPreferences {
    @TableId
    private Long id;

    /**
     *
     */
    private Long userid;

    /**
     *
     */
    private Integer belongto;

    private Integer noMoreThanTime;

    private Integer noWorkDay;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
