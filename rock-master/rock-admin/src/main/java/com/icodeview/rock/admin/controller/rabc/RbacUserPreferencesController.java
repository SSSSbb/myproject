package com.icodeview.rock.admin.controller.rabc;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.icodeview.rock.admin.dto.RbacTodoDto;
import com.icodeview.rock.admin.dto.UserPreferencesDto;
import com.icodeview.rock.admin.service.RbacUserPreferencesService;
import com.icodeview.rock.admin.service.RbacUserScheduleService;
import com.icodeview.rock.admin.vo.RbacTodoVo;
import com.icodeview.rock.admin.vo.RbacUserPreferencesVo;
import com.icodeview.rock.vo.CommonResult;
import com.icodeview.rock.vo.PageResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@Api(tags = "排班管理")
@ApiSort(1)
@RestController("RbacPreferencesController")
@RequestMapping("/schedule/preferences")
public class RbacUserPreferencesController {
    @Resource
    private RbacUserPreferencesService preferencesService;

    @Resource
    private RbacUserScheduleService scheduleService;
    @ApiOperation("列表")
    @ApiOperationSupport(order = 1, author = "刘紫璇")
    @GetMapping("index")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "userid",value = "userid"),
            @ApiImplicitParam(name = "noWorkDay",value = "noWorkDay"),
            @ApiImplicitParam(name = "noMoreThanTime",value = "noMoreThanTime"),
            @ApiImplicitParam(name = "belongto",value = "所属公司"),
            @ApiImplicitParam(name = "current",value = "页码"),
            @ApiImplicitParam(name = "pageSize",value = "条数")
    })

    public CommonResult<PageResult<RbacUserPreferencesVo>> index(
            @RequestParam(value = "id", required = false) Long id,
            @RequestParam(value = "userid", required = false) Long userid,
            @RequestParam(value = "noWorkDay", required = false) Integer noWorkDay,
            @RequestParam(value = "noMoreThanTime", required = false) Integer noMoreThanTime,
            @RequestParam(value = "belongto", required = false) Integer belongto,
            @RequestParam(value = "current", required = false, defaultValue = "1") Long pageNum,
            @RequestParam(value = "pageSize", required = false, defaultValue = "20") Long pageSize
    ) {
        PageResult<RbacUserPreferencesVo> result = preferencesService.getIndex(id,userid,noWorkDay,belongto,noMoreThanTime,pageNum, pageSize);
        return CommonResult.success(result);
    }
    @ApiOperationSupport(order = 2, author = "刘紫璇")
    @ApiOperation("添加")
    @PostMapping("create")
    public CommonResult<Void> create(@RequestBody @Validated UserPreferencesDto dto) {
        preferencesService.createPreferences(dto);
        return CommonResult.success("添加成功！");
    }
    @ApiOperationSupport(order = 3, author = "刘紫璇")
    @ApiOperation("更新")
    @PostMapping("update")
    public CommonResult<Void> update(@RequestBody @Validated UserPreferencesDto dto) {
        preferencesService.updatePreferences(dto);
        return CommonResult.success("编辑成功！");
    }
    @ApiOperationSupport(order = 4, author = "刘紫璇")
    @ApiOperation("删除")
    @GetMapping("delete")
    @ApiImplicitParam(value = "id", name = "id", required = true)
    public CommonResult<Void> delete(@RequestParam(value = "id") Integer id) {
        preferencesService.deletePreferences(id);
        return CommonResult.success("删除成功！");
    }
    @ApiOperationSupport(order = 5, author = "刘紫璇")
    @ApiOperation("生成")
    @GetMapping("generate")
    @ApiImplicitParam(value = "id", name = "id", required = true)
    public CommonResult<Void> generate(@RequestParam(value = "belongto") Integer belongto) {
        System.out.println("11111");
        System.out.println(belongto);
        scheduleService.generate(belongto);
        return CommonResult.success("生成成功！");
    }
}
