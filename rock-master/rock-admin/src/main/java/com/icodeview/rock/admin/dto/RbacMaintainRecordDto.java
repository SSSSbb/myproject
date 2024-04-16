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

    @ApiModelProperty(value = "所属公司",name = "belongto",required = true)
    private Integer belongto;
    @ApiModelProperty(value = "进行的项目",name = "project",required = true)
    private String project;
    @ApiModelProperty(value = "工作",name = "work",required = true)
    private String work;
    @ApiModelProperty(value = "创建时间",name = "createAt",required = true)
    private LocalDateTime createAt;
    @ApiModelProperty(value = "更新时间",name = "updateAt",required = true)
    private LocalDateTime updateAt;
    @ApiModelProperty(value = "零件记录ID",name = "partsRecord",required = true)
    private Integer partsRecord;
}
