package com.icodeview.rock.admin.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RbacBasicInfoDto {
    private Integer id;
    @ApiModelProperty(value = "电梯档案id",name = "profileid",required = true)
    private Integer profileid;
    @ApiModelProperty(value = "名称",name = "name",required = true)
    private String name;
    @ApiModelProperty(value = "信息",name = "info",required = true)
    private String info;
    @ApiModelProperty(value = "属于",name = "belongto",required = true)
    private Integer belongto;
}
