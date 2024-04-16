package com.icodeview.rock.admin.controller.rabc;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.icodeview.rock.admin.dto.RbacMaintainDto;
import com.icodeview.rock.admin.dto.RbacPartsRecordDto;
import com.icodeview.rock.admin.service.RbacPartsRecordService;
import com.icodeview.rock.admin.vo.RbacMaintainVo;
import com.icodeview.rock.admin.vo.RbacPartsRecordVo;
import com.icodeview.rock.vo.CommonResult;
import com.icodeview.rock.vo.PageResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@Api(tags = "零件管理-记录管理")
@ApiSort(2)
@RestController
@RequestMapping("/parts/record")
public class PartsRecordController {
    @Resource
    private RbacPartsRecordService rbacPartsRecordService;
    @ApiOperation("列表")
    @ApiOperationSupport(order = 1, author = "刘紫璇")
    @GetMapping("index")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "recordId",value = "记录id"),
            @ApiImplicitParam(name = "partId",value = "零件id"),
            @ApiImplicitParam(name = "action",value = "动作"),
            @ApiImplicitParam(name = "replacePart",value = "更换零件"),
            @ApiImplicitParam(name = "extrainfo",value = "备注"),
            @ApiImplicitParam(name = "belongto",value = "属于"),
            @ApiImplicitParam(name = "current",value = "页码"),
            @ApiImplicitParam(name = "pageSize",value = "条数")
    })

    public CommonResult<PageResult<RbacPartsRecordVo>> index(
            @RequestParam(value = "id", required = false) Integer id,
            @RequestParam(value = "record_id", required = false) Integer recordId,
            @RequestParam(value = "partId", required = false) Integer partId,
            @RequestParam(value = "action", required = false) String action,
            @RequestParam(value = "replace_part", required = false) Integer replacePart,
            @RequestParam(value = "extrainfo", required = false) String extrainfo,
            @RequestParam(value = "belongto", required = false) Integer belongto,
            @RequestParam(value = "current", required = false, defaultValue = "1") Long pageNum,
            @RequestParam(value = "pageSize", required = false, defaultValue = "20") Long pageSize
    ) {
        PageResult<RbacPartsRecordVo> result = rbacPartsRecordService.getIndex(id,recordId,partId,action,replacePart,belongto,pageNum, pageSize);
        return CommonResult.success(result);
    }
    @ApiOperationSupport(order = 2, author = "刘紫璇")
    @ApiOperation("添加")
    @PostMapping("create")
    public CommonResult<Void> create(@RequestBody @Validated RbacPartsRecordDto dto) {
        rbacPartsRecordService.createPartsRecord(dto);
        return CommonResult.success("添加成功！");
    }
    @ApiOperationSupport(order = 3, author = "刘紫璇")
    @ApiOperation("删除")
    @GetMapping("delete")
    @ApiImplicitParam(value = "id", name = "id", required = true)
    public CommonResult<Void> delete(@RequestParam(value = "id") Integer id) {
        rbacPartsRecordService.deletePartsRecord(id);
        return CommonResult.success("删除成功！");
    }
    @ApiOperationSupport(order = 3, author = "刘紫璇")
    @ApiOperation("更新")
    @PostMapping("update")
    public CommonResult<Void> update(@RequestBody @Validated RbacPartsRecordDto dto) {
        rbacPartsRecordService.updateRartsRecord(dto);
        return CommonResult.success("编辑成功！");
    }
}
