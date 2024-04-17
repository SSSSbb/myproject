package com.icodeview.rock.admin.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class RbacTodoDto {
    private Integer id;
    @ApiModelProperty(value = "负责人",name = "username",required = true)
    private String username;
    @ApiModelProperty(value = "代办目标",name = "which",required = true)
    private Integer which;
    @ApiModelProperty(value = "属于",name = "belongto",required = true)
    private Integer belongto;
    @ApiModelProperty(value = "代办状态",name = "status",required = true)
    private Integer status;
    @ApiModelProperty(value = "创建人",name = "createby",required = true)
    private String createby;
    @ApiModelProperty(value = "内容",name = "content",required = true)
    private String content;

    @ApiModelProperty(value = "创建时间",name = "createAt",required = true)
    private LocalDateTime createdAt;

    @ApiModelProperty(value = "完成时间",name = "finishAt",required = true)
    private LocalDateTime finishAt;
}
