package com.icodeview.rock.admin.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
public class RbacMaintainRecordDto {
    private Integer id;
    @ApiModelProperty(value = "公司签名",name = "enpSign",required = true)
    private byte[] enpSign;
    @ApiModelProperty(value = "安全员签名",name = "safeSign",required = true)
    private byte[] safeSign;
    @ApiModelProperty(value = "电梯ID",name = "eid",required = true)
    private Integer eid;
    @ApiModelProperty(value = "维保员",name = "maintainer",required = true)
    private String maintainer;
    @ApiModelProperty(value = "安全员",name = "safer",required = true)
    private String safer;
    @ApiModelProperty(value = "是否被退回",name = "returned",required = true)
    private Integer returned;

    @ApiModelProperty(value = "退回理由",name = "reason",required = true)
    private String reason;

    @ApiModelProperty(value = "打卡照片",name = "pic",required = true)
    private byte[] pic;

    @ApiModelProperty(value = "打卡照片2",name = "saferpic",required = true)
    private byte[] saferpic;

    @ApiModelProperty(value = "所属公司",name = "belongto",required = true)
    private Integer belongto;
    @ApiModelProperty(value = "进行的项目",name = "project",required = true)
    private String project;
    @ApiModelProperty(value = "工作",name = "work",required = true)
    private String action;
    @ApiModelProperty(value = "创建时间",name = "createAt",required = true)
    private LocalDateTime createAt;
    @ApiModelProperty(value = "更新时间",name = "updateAt",required = true)
    private LocalDateTime updateAt;
    @ApiModelProperty(value = "零件记录ID",name = "partsRecord",required = true)
    private Integer partsRecord;
}
