package com.icodeview.rock.admin.controller.rabc;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.icodeview.rock.admin.common.Result;
import com.icodeview.rock.admin.dto.RbacUserScheduleDto;
import com.icodeview.rock.admin.pojo.RbacUser;
import com.icodeview.rock.admin.pojo.RbacUserSchedule;
import com.icodeview.rock.admin.service.RbacUserScheduleService;
import com.icodeview.rock.admin.vo.RbacUserPreferencesVo;
import com.icodeview.rock.admin.vo.RbacUserScheduleVo;
import com.icodeview.rock.vo.CommonResult;
import com.icodeview.rock.vo.PageResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Api(tags = "排班管理")
@ApiSort(1)
@RestController("RbacUserScheduleController")
@RequestMapping("/schedule/schedulelist")
public class RbacUserScheduleController {
    @Resource
    private RbacUserScheduleService scheduleService;
    @ApiOperation("列表")
    @ApiOperationSupport(order = 1, author = "刘紫璇")
    @GetMapping("index")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "userid",value = "userid"),
            @ApiImplicitParam(name = "slot",value = "slot"),
            @ApiImplicitParam(name = "weekday",value = "weekday"),
            @ApiImplicitParam(name = "create_time",value = "create_time"),
            @ApiImplicitParam(name = "belongto",value = "所属公司"),
            @ApiImplicitParam(name = "current",value = "页码"),
            @ApiImplicitParam(name = "pageSize",value = "条数")
    })

    public CommonResult<List<RbacUserScheduleVo>> index(
            @RequestParam(value = "id", required = false) Integer id,
            @RequestParam(value = "userid", required = false) Integer userid,
//            @RequestParam(value = "slot", required = false) Integer slot,
//            @RequestParam(value = "weekday", required = false) Integer weekday,
            @RequestParam(value = "belongto", required = false) Integer belongto,
            @RequestParam(value = "current", required = false, defaultValue = "1") Long pageNum,
            @RequestParam(value = "pageSize", required = false, defaultValue = "20") Long pageSize
    ) {
        List<RbacUserScheduleVo> result = scheduleService.getIndex(id,userid,belongto);
        return CommonResult.success(result);
    }

}
