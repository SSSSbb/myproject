package com.icodeview.rock.admin.pojo;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * null
 * @TableName rbac_parts
 */
@Setter
@Getter
public class RbacParts {
    @TableId
    private Integer id;

    /**
     *
     */
    private String name;
    private String spec;
    private String model;
    private String sup;
    private String man;
    private Integer used;
    private Integer belongto;
    private Integer diposed;
    private Integer remain;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime buyAt;
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
