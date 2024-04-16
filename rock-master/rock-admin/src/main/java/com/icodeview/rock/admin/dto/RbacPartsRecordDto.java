package com.icodeview.rock.admin.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RbacPartsRecordDto {
    private Integer id;
    @ApiModelProperty(value = "维保记录id",name = "recordId",required = true)
    private Integer recordId;
    @ApiModelProperty(value = "零件id",name = "partId",required = true)
    private Integer partId;
    @ApiModelProperty(value = "动作",name = "action",required = true)

    private String action;

    @ApiModelProperty(value = "更换零件id",name = "replacePart",required = true)
    private Integer replacePart;
    @ApiModelProperty(value = "动作说明",name = "extrainfo",required = true)
    private String extrainfo;
    @ApiModelProperty(value = "属于",name = "belongto",required = true)
    private Integer belongto;

}
