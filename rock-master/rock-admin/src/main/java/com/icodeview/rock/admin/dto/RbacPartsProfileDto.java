package com.icodeview.rock.admin.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
public class RbacPartsProfileDto {
    private Integer id;
    @ApiModelProperty(value = "关联id",name = "partsid",required = true)
    private Integer partsid;
    @ApiModelProperty(value = "名称",name = "name",required = true)
    private String name;
    @ApiModelProperty(value = "保养类型",name = "maintaintype",required = true)
    private String maintaintype;
    @ApiModelProperty(value = "状态",name = "staus",required = true)
    private String status;
    @ApiModelProperty(value = "电梯",name = "which",required = true)
    private Integer which;
    @ApiModelProperty(value = "所属公司",name = "belongto",required = true)
    private Integer belongto;
    @ApiModelProperty(value = "上次保养",name = "lastMaintain",required = true)
    private LocalDateTime lastMaintain;
    @ApiModelProperty(value = "上次维修",name = "lastRepair",required = true)
    private LocalDateTime lastRepair;
    @ApiModelProperty(value = "创建时间",name = "createAt",required = true)
    private LocalDateTime createAt;
    @ApiModelProperty(value = "更新时间",name = "updateAt",required = true)
    private LocalDateTime updateAt;
    @ApiModelProperty(value = "报废时间",name = "diposedAt",required = true)
    private LocalDateTime diposedAt;
}
