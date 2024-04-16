package com.icodeview.rock.admin.controller.rabc;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.ApiSort;
import com.icodeview.rock.admin.dto.RbacBasicInfoDto;
import com.icodeview.rock.admin.dto.RbacMaintainDto;
import com.icodeview.rock.admin.service.RbacBasicInfoService;
import com.icodeview.rock.admin.vo.RbacBasicInfoVo;
import com.icodeview.rock.admin.vo.RbacMaintainVo;
import com.icodeview.rock.vo.CommonResult;
import com.icodeview.rock.vo.PageResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@Api(tags = "基本信息-基本技术参数管理")
@ApiSort(2)
@RestController
@RequestMapping("/basic/info")
public class BasicInfoController {
    @Resource
    private RbacBasicInfoService rbacBasicInfoService;

    @ApiOperation("列表")
    @ApiOperationSupport(order = 1, author = "刘紫璇")
    @GetMapping("index")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id",value = "id"),
            @ApiImplicitParam(name = "profileid",value = "电梯信息id"),
            @ApiImplicitParam(name = "name",value = "名称"),
            @ApiImplicitParam(name = "info",value = "基本技术参数信息"),
            @ApiImplicitParam(name = "belongto",value = "属于"),
            @ApiImplicitParam(name = "current",value = "页码"),
            @ApiImplicitParam(name = "pageSize",value = "条数")
    })

    public CommonResult<PageResult<RbacBasicInfoVo>> index(
            @RequestParam(value = "id", required = false) Integer id,
            @RequestParam(value = "profileid", required = false) Integer profileid,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "belongto", required = false) Integer belongto,
            @RequestParam(value = "current", required = false, defaultValue = "1") Long pageNum,
            @RequestParam(value = "pageSize", required = false, defaultValue = "20") Long pageSize
    ) {
        PageResult<RbacBasicInfoVo> result = rbacBasicInfoService.getIndex(id,profileid,name,belongto,pageNum, pageSize);
        return CommonResult.success(result);
    }
    @ApiOperationSupport(order = 2, author = "刘紫璇")
    @ApiOperation("添加")
    @PostMapping("create")
    public CommonResult<Void> create(@RequestBody @Validated RbacBasicInfoDto dto) {
        rbacBasicInfoService.createBasicInfo(dto);
        return CommonResult.success("添加成功！");
    }
    @ApiOperationSupport(order = 3, author = "刘紫璇")
    @ApiOperation("删除")
    @GetMapping("delete")
    @ApiImplicitParam(value = "id", name = "id", required = true)
    public CommonResult<Void> delete(@RequestParam(value = "id") Integer id) {
        rbacBasicInfoService.deleteBasicInfo(id);
        return CommonResult.success("删除成功！");
    }


    @ApiOperationSupport(order = 3, author = "刘紫璇")
    @ApiOperation("更新")
    @PostMapping("update")
    public CommonResult<Void> update(@RequestBody @Validated RbacBasicInfoDto dto) {
        rbacBasicInfoService.updateBasicInfo(dto);
        return CommonResult.success("编辑成功！");
    }

}
