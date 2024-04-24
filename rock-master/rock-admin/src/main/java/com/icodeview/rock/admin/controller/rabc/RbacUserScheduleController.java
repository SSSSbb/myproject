package com.icodeview.rock.admin.controller.rabc;

import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.icodeview.rock.admin.service.RbacUserScheduleService;
import io.swagger.annotations.Api;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@Api(tags = "排班管理")
@ApiSort(1)
@RestController("RbacUserScheduleController")
@RequestMapping("/schedule/schedulelist")
public class RbacUserScheduleController {
    @Resource
    private RbacUserScheduleService scheduleService;

}
