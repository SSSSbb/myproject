package com.icodeview.rock.admin.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UserPreferencesDto {
    private Long id;
    @ApiModelProperty(value = "userid",name = "userid",required = true)
    private Long userid;
    @ApiModelProperty(value = "周几不上班",name = "noWorkDay",required = true)
    private Integer noWorkDay;
    @ApiModelProperty(value = "属于",name = "belongto",required = true)
    private Integer belongto;
    @ApiModelProperty(value = "一天工作不超过几小时",name = "noMoreThanTime",required = true)
    private Integer noMoreThanTime;

}
