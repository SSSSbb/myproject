package com.icodeview.rock.admin.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class RbacSlotDto {
    private Integer id;

    @ApiModelProperty(value = "代码",name = "code",required = true)
    private Integer code;

    @ApiModelProperty(value = "时段名称",name = "slot",required = true)
    private String slot;

    @ApiModelProperty(value = "所属",name = "belongto",required = true)
    private Integer belongto;

    @ApiModelProperty(value = "更新时间",name = "updatedAt",required = true)
    private LocalDateTime updatedAt;
}
