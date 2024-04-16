package com.icodeview.rock.admin.controller.rabc;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.icodeview.rock.admin.dto.RbacPartsDto;
import com.icodeview.rock.admin.dto.RbacPartsProfileDto;
import com.icodeview.rock.admin.service.RbacPartsProfileService;
import com.icodeview.rock.admin.service.RbacPartsService;
import com.icodeview.rock.admin.vo.RbacPartsVo;
import com.icodeview.rock.admin.vo.partsProfileVo;
import com.icodeview.rock.vo.CommonResult;
import com.icodeview.rock.vo.PageResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@Api(tags = "零件管理")
@ApiSort(2)
@RestController
@RequestMapping("/parts/partsprofile")
public class PartsProfileController {
    @Resource
    private RbacPartsProfileService rbacPartsProfileService;
    @Resource
    private RbacPartsService rbacPartsService;

    @ApiOperation("列表")
    @ApiOperationSupport(order = 1, author = "刘紫璇")
    @GetMapping("index")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id",value = "ID"),
            @ApiImplicitParam(name = "partsid",value = "零件ID"),
            @ApiImplicitParam(name = "name",value = "标题"),
            @ApiImplicitParam(name = "maintaintype",value = "保养类型"),
            @ApiImplicitParam(name = "status",value = "状态"),
            @ApiImplicitParam(name = "which",value = "电梯"),
            @ApiImplicitParam(name = "belongto",value = "属于"),
            @ApiImplicitParam(name = "current",value = "页码"),
            @ApiImplicitParam(name = "pageSize",value = "条数")
    })
    public CommonResult<PageResult<partsProfileVo>> index(
            @RequestParam(value = "id", required = false) Integer id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "which", required = false) Integer which,
            @RequestParam(value = "partsid", required = false) Integer partsid,
            @RequestParam(value = "maintaintype", required = false) String maintaintype,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "belongto", required = false) Integer belongto,
            @RequestParam(value = "current", required = false, defaultValue = "1") Long pageNum,
            @RequestParam(value = "pageSize", required = false, defaultValue = "20") Long pageSize
    ) {
        PageResult<partsProfileVo> result = rbacPartsProfileService.getIndex(id, partsid,name,status, which,maintaintype,belongto,  pageNum,  pageSize);
        return CommonResult.success(result);
    }
    @ApiOperationSupport(order = 2, author = "刘紫璇")
    @ApiOperation("更新")
    @PostMapping("update")
    public CommonResult<Void> update(@RequestBody @Validated RbacPartsProfileDto dto) {
        rbacPartsProfileService.updatePartsProfile(dto);
        return CommonResult.success("编辑成功！");
    }
    @ApiOperationSupport(order = 3, author = "刘紫璇")
    @ApiOperation("添加")
    @PostMapping("create")
    public CommonResult<Void> create(@RequestBody @Validated RbacPartsProfileDto dto) {
        rbacPartsProfileService.createPartsProfile(dto);
        rbacPartsService.PartsUse(dto.getPartsid());
        return CommonResult.success("添加成功！");
    }
    @ApiOperationSupport(order = 4, author = "刘紫璇")
    @ApiOperation("删除")
    @GetMapping("delete")
    @ApiImplicitParam(value = "id", name = "id", required = true)
    public CommonResult<Void> delete(@RequestParam(value = "id") Integer id,@RequestParam(value = "partsid") Integer partsid) {
        rbacPartsProfileService.deletePartsProfile(id);
        rbacPartsService.PartsDipose(partsid);
        return CommonResult.success("报废成功！");
    }
}
