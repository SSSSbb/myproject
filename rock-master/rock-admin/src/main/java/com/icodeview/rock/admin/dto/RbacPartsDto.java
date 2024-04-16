package com.icodeview.rock.admin.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class RbacPartsDto {
    private Integer id;
    @ApiModelProperty(value = "名称",name = "name",required = true)
    private String name;
    @ApiModelProperty(value = "规格",name = "spec",required = true)
    private String spec;
    @ApiModelProperty(value = "型号",name = "model",required = true)
    private String model;
    @ApiModelProperty(value = "供货商",name = "sup",required = true)
    private String sup;
    @ApiModelProperty(value = "生产厂家",name = "man",required = true)
    private String man;
    @ApiModelProperty(value = "正在使用",name = "using",required = true)
    private Integer used;
    @ApiModelProperty(value = "剩余",name = "remain",required = true)
    private Integer remain;
    @ApiModelProperty(value = "已报废",name = "diposed",required = true)
    private Integer diposed;
    @ApiModelProperty(value = "所属公司",name = "belongto",required = true)
    private Integer belongto;
    @ApiModelProperty(value = "购买时间",name = "buyAt",required = true)
    private LocalDateTime buyAt;
}
