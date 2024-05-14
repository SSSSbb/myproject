package com.icodeview.rock.admin.controller.rabc;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.icodeview.rock.admin.dto.RbacMaintainRecordDto;
import com.icodeview.rock.admin.service.RbacMaintainRecordService;
import com.icodeview.rock.admin.vo.RbacMaintainRecordVo;
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
@RequestMapping("/maintain/record")
public class RbacMaintainRecordController {
    @Resource
    private RbacMaintainRecordService rbacMaintainRecordService;
    @ApiOperation("列表")
    @ApiOperationSupport(order = 1, author = "刘紫璇")
    @GetMapping("index")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id",value = "ID"),
            @ApiImplicitParam(name = "eid",value = "eID"),
            @ApiImplicitParam(name = "enpSign",value = "使用单位签名"),
            @ApiImplicitParam(name = "pic",value = "打卡图片"),
            @ApiImplicitParam(name = "saferpic",value = "打卡图片2"),
            @ApiImplicitParam(name = "safeSign",value = "安全员签名"),
            @ApiImplicitParam(name = "maintainer",value = "维保员"),
            @ApiImplicitParam(name = "safer",value = "安全员"),
            @ApiImplicitParam(name = "project",value = "项目"),
            @ApiImplicitParam(name = "work",value = "工作"),
            @ApiImplicitParam(name = "returned",value = "是否被退回"),
            @ApiImplicitParam(name = "partsRecord",value = "相关的零件记录"),
            @ApiImplicitParam(name = "belongto",value = "属于"),
            @ApiImplicitParam(name = "current",value = "页码"),
            @ApiImplicitParam(name = "pageSize",value = "条数")
    })
    public CommonResult<PageResult<RbacMaintainRecordVo>> index(
            @RequestParam(value = "id", required = false) Integer id,
            @RequestParam(value = "eid", required = false) Integer eid,
            @RequestParam(value = "returned", required = false) Integer returned,
            @RequestParam(value = "maintainer", required = false) String maintainer,
            @RequestParam(value = "safer", required = false) String safer,
            @RequestParam(value = "work", required = false) String work,
            @RequestParam(value = "partsRecord", required = false) Integer partsRecord,
            @RequestParam(value = "belongto", required = false) Integer belongto,
            @RequestParam(value = "current", required = false, defaultValue = "1") Long pageNum,
            @RequestParam(value = "pageSize", required = false, defaultValue = "20") Long pageSize
    ) {
        PageResult<RbacMaintainRecordVo> result = rbacMaintainRecordService.getIndex(returned,eid,work,id, maintainer,belongto,partsRecord,safer,pageNum,  pageSize);
        return CommonResult.success(result);
    }

    @ApiOperationSupport(order = 2, author = "刘紫璇")
    @ApiOperation("更新")
    @PostMapping("update")
    public CommonResult<Void> update(@RequestBody @Validated RbacMaintainRecordDto dto) {
        rbacMaintainRecordService.updateMaintainRecord(dto);
        return CommonResult.success("编辑成功！");
    }
    @ApiOperationSupport(order = 3, author = "刘紫璇")
    @ApiOperation("添加")
    @PostMapping("create")
    public CommonResult<Integer> create(@RequestBody @Validated RbacMaintainRecordDto dto) {
        Integer id = rbacMaintainRecordService.createMaintainRecord(dto);
        return CommonResult.success("添加成功！",id);
    }
    @ApiOperationSupport(order = 4, author = "刘紫璇")
    @ApiOperation("删除")
    @GetMapping("delete")
    @ApiImplicitParam(value = "id", name = "id", required = true)
    public CommonResult<Void> delete(@RequestParam(value = "id") Integer id) {
        rbacMaintainRecordService.deleteMaintainRecord(id);
        return CommonResult.success("删除成功！");
    }
}
