package com.icodeview.rock.admin.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class RbacNoticeDto {
    private Integer id;

    @ApiModelProperty(value = "创建时间",name = "createby",required = true)
    private String createby;

    @ApiModelProperty(value = "内容",name = "content",required = true)
    private String content;

    @ApiModelProperty(value = "状态",name = "status",required = true)
    private Integer status;

    @ApiModelProperty(value = "所属",name = "belongto",required = true)
    private Integer belongto;

    @ApiModelProperty(value = "更新时间",name = "updatedAt",required = true)
    private LocalDateTime updatedAt;

    @ApiModelProperty(value = "创建时间",name = "createdAt",required = true)
    private LocalDateTime createdAt;
}
