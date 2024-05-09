package com.icodeview.rock.admin.controller.rabc;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.icodeview.rock.admin.dto.RbacNoticeDto;
import com.icodeview.rock.admin.dto.RbacSlotDto;
import com.icodeview.rock.admin.service.RbacSlotService;
import com.icodeview.rock.admin.vo.RbacNoticeVo;
import com.icodeview.rock.admin.vo.RbacSlotVo;
import com.icodeview.rock.vo.CommonResult;
import com.icodeview.rock.vo.PageResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@Api(tags = "时段")
@ApiSort(2)
@RestController
@RequestMapping("/schedule/slot")
public class RbacSlotController {

    @Resource
    private RbacSlotService rbacSlotService;

    @ApiOperation("列表")
    @ApiOperationSupport(order = 1, author = "刘紫璇")
    @GetMapping("index")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "code",value = "创建人"),
            @ApiImplicitParam(name = "slot",value = "内容"),
            @ApiImplicitParam(name = "belongto",value = "属于"),
            @ApiImplicitParam(name = "current",value = "页码"),
            @ApiImplicitParam(name = "pageSize",value = "条数")
    })

    public CommonResult<PageResult<RbacSlotVo>> index(
            @RequestParam(value = "code", required = false) Integer code,
            @RequestParam(value = "slot", required = false) String slot,
            @RequestParam(value = "belongto", required = false) Integer belongto,
            @RequestParam(value = "current", required = false, defaultValue = "1") Long pageNum,
            @RequestParam(value = "pageSize", required = false, defaultValue = "20") Long pageSize
    ) {
        PageResult<RbacSlotVo> result = rbacSlotService.getIndex(belongto,pageNum, pageSize);
        return CommonResult.success(result);
    }

    @ApiOperationSupport(order = 2, author = "刘紫璇")
    @ApiOperation("添加")
    @PostMapping("create")
    public CommonResult<Void> create(@RequestBody @Validated RbacSlotDto dto) {
        rbacSlotService.createSlot(dto);
        return CommonResult.success("添加成功！");
    }
    @ApiOperationSupport(order = 3, author = "刘紫璇")
    @ApiOperation("更新")
    @PostMapping("update")
    public CommonResult<Void> update(@RequestBody @Validated RbacSlotDto dto) {
        rbacSlotService.updateSlot(dto);
        return CommonResult.success("编辑成功！");
    }
}
